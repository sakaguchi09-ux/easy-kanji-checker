import { isKanji } from "./isKanji";
import { katakanaToHiragana } from "./katakanaToHiragana";

type Segment = { type: "kanji" | "kana"; text: string };

type KanjiGroup = { text: string; hasUnlearned: boolean };

/** 表層形を漢字連続部とかな連続部に分割 */
export function splitKanjiKana(surface: string): Segment[] {
  const segments: Segment[] = [];
  let buffer = "";
  let currentType: "kanji" | "kana" | null = null;

  for (const char of surface) {
    const type: "kanji" | "kana" = isKanji(char) ? "kanji" : "kana";

    if (currentType === null) {
      currentType = type;
      buffer = char;
      continue;
    }

    if (currentType === type) {
      buffer += char;
    } else {
      segments.push({ type: currentType, text: buffer });
      currentType = type;
      buffer = char;
    }
  }

  if (buffer && currentType) {
    segments.push({ type: currentType, text: buffer });
  }

  return segments;
}

/** 送り仮名（末尾かな）を読みから除き、漢字部分の読みを得る */
function extractKanjiReading(
  readingHira: string,
  trailingKana: string,
): string {
  if (!trailingKana) return readingHira;

  if (readingHira.endsWith(trailingKana)) {
    return readingHira.slice(0, readingHira.length - trailingKana.length);
  }

  for (let len = Math.min(trailingKana.length, readingHira.length); len >= 1; len--) {
    const suffix = trailingKana.slice(-len);
    if (readingHira.endsWith(suffix)) {
      return readingHira.slice(0, readingHira.length - len);
    }
  }

  return readingHira;
}

function groupKanjiByLearning(
  kanjiText: string,
  allowed: ReadonlySet<string>,
): KanjiGroup[] {
  const groups: KanjiGroup[] = [];

  for (const char of kanjiText) {
    const hasUnlearned = !allowed.has(char);
    const last = groups[groups.length - 1];

    if (last && last.hasUnlearned === hasUnlearned) {
      last.text += char;
    } else {
      groups.push({ text: char, hasUnlearned });
    }
  }

  return groups;
}

/** 漢字ブロック内で、未習部分だけに（読み）を付ける */
function formatKanjiBlockWithFurigana(
  kanjiText: string,
  kanjiReading: string,
  allowed: ReadonlySet<string>,
): string {
  const groups = groupKanjiByLearning(kanjiText, allowed);

  if (!groups.some((g) => g.hasUnlearned)) {
    return kanjiText;
  }

  const allUnlearned = groups.every((g) => g.hasUnlearned);
  if (allUnlearned) {
    return `${kanjiText}（${kanjiReading}）`;
  }

  const totalKanjiLen = kanjiText.length;
  const learnedChars = groups
    .filter((g) => !g.hasUnlearned)
    .reduce((sum, g) => sum + g.text.length, 0);

  let readEnd = kanjiReading.length;

  if (learnedChars > 0) {
    let consumed = 0;
    for (let i = groups.length - 1; i >= 0; i--) {
      const group = groups[i];
      if (!group.hasUnlearned) {
        const share = Math.max(
          1,
          Math.round(
            (kanjiReading.length * group.text.length) / learnedChars,
          ),
        );
        consumed += share;
      }
    }
    readEnd = Math.max(0, kanjiReading.length - consumed);
  }

  const availableReading = kanjiReading.slice(0, readEnd);
  const unlearnedChars = groups
    .filter((g) => g.hasUnlearned)
    .reduce((sum, g) => sum + g.text.length, 0);

  let readPos = 0;
  let result = "";

  for (const group of groups) {
    if (!group.hasUnlearned) {
      result += group.text;
      continue;
    }

    const share =
      unlearnedChars > 0
        ? Math.max(
            1,
            Math.round(
              (availableReading.length * group.text.length) / unlearnedChars,
            ),
          )
        : 0;

    const partReading = availableReading.slice(readPos, readPos + share);
    readPos += share;

    result += partReading
      ? `${group.text}（${partReading}）`
      : group.text;
  }

  return result;
}

/**
 * ふりがな表示: 未習漢字を含む部分だけに読みを付ける
 * 例: 待（ま）ち / 頑張（がんば）り / 運動会（うんどうかい）
 */
export function formatTokenWithPartialFurigana(
  surface: string,
  reading: string | undefined,
  allowed: ReadonlySet<string>,
): string {
  const hasUnlearned = [...surface].some(
    (char) => isKanji(char) && !allowed.has(char),
  );
  if (!hasUnlearned) return surface;

  const readingHira = reading ? katakanaToHiragana(reading) : null;
  if (!readingHira) return surface;

  const segments = splitKanjiKana(surface);
  if (segments.length === 0) return surface;

  let result = "";

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment.type === "kana") {
      result += segment.text;
      continue;
    }

    const trailingKana = segments
      .slice(i + 1)
      .filter((s) => s.type === "kana")
      .map((s) => s.text)
      .join("");

    const kanjiReading = extractKanjiReading(readingHira, trailingKana);
    result += formatKanjiBlockWithFurigana(
      segment.text,
      kanjiReading,
      allowed,
    );
  }

  return result;
}
