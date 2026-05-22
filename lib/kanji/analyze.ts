import type { GradeLevel } from "@/data/kanji";
import { getAllowedKanjiSet } from "./allowedKanji";
import { isKanji } from "./isKanji";

export type TextSegment = {
  text: string;
  /** 未習漢字（選択学年までに含まれない漢字） */
  highlighted: boolean;
};

export type AnalyzeResult = {
  /** 変換結果欄に表示する原文 */
  displayText: string;
  segments: TextSegment[];
  /** 未習漢字の一覧（重複なし・出現順） */
  unlearnedKanji: string[];
};

/**
 * 入力文を1文字ずつ確認し、未習漢字を検出する（簡易版・読み変換なし）
 */
export function analyzeText(text: string, grade: GradeLevel): AnalyzeResult {
  const allowed = getAllowedKanjiSet(grade);
  const segments: TextSegment[] = [];
  const unlearnedSeen = new Set<string>();
  const unlearnedKanji: string[] = [];

  for (const char of text) {
    const highlighted = isKanji(char) && !allowed.has(char);

    if (highlighted && !unlearnedSeen.has(char)) {
      unlearnedSeen.add(char);
      unlearnedKanji.push(char);
    }

    const last = segments[segments.length - 1];
    if (last && last.highlighted === highlighted) {
      last.text += char;
    } else {
      segments.push({ text: char, highlighted });
    }
  }

  return {
    displayText: text,
    segments,
    unlearnedKanji,
  };
}
