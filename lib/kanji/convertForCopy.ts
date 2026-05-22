import type { GradeLevel } from "@/data/kanji";
import { getAllowedKanjiSet } from "./allowedKanji";
import { isKanji } from "./isKanji";
import { katakanaToHiragana } from "./katakanaToHiragana";
import { formatTokenWithPartialFurigana } from "./furiganaFormat";
import type { KuromojiTokenizer } from "./kuromojiLoader";

export type DisplayMode = "gentle" | "furigana";

/** トークンに未習漢字が1文字でも含まれるか */
function hasUnlearnedKanji(
  surface: string,
  allowed: ReadonlySet<string>,
): boolean {
  return [...surface].some((char) => isKanji(char) && !allowed.has(char));
}

function getHiraganaReading(reading: string | undefined): string | null {
  if (!reading) return null;
  return katakanaToHiragana(reading);
}

/** やさしさ優先: 未習漢字が1文字でもあれば語全体をひらがな化 */
function convertTokenGentle(
  surface: string,
  reading: string | undefined,
  allowed: ReadonlySet<string>,
): string {
  if (!hasUnlearnedKanji(surface, allowed)) {
    return surface;
  }

  const hira = getHiraganaReading(reading);
  return hira ?? surface;
}

/** ふりがな表示: 未習漢字部分だけに読みを付ける */
function convertTokenFurigana(
  surface: string,
  reading: string | undefined,
  allowed: ReadonlySet<string>,
): string {
  return formatTokenWithPartialFurigana(surface, reading, allowed);
}

/**
 * kuromoji で形態素解析し、表示モードに応じたコピー用文章を生成
 */
export function buildCopyText(
  text: string,
  grade: GradeLevel,
  tokenizer: KuromojiTokenizer,
  mode: DisplayMode = "gentle",
): string {
  if (!text) return "";

  const allowed = getAllowedKanjiSet(grade);
  const tokens = tokenizer.tokenize(text);
  const convertToken =
    mode === "furigana" ? convertTokenFurigana : convertTokenGentle;

  return tokens
    .map((token) =>
      convertToken(
        token.surface_form,
        token.reading || token.pronunciation,
        allowed,
      ),
    )
    .join("");
}
