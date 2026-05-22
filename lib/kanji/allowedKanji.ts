import {
  KANJI_SET_BY_GRADE,
  type GradeLevel,
} from "@/data/kanji";

const cumulativeCache = new Map<GradeLevel, ReadonlySet<string>>();

/** 選択学年までに習う漢字の集合（累積） */
export function getAllowedKanjiSet(grade: GradeLevel): ReadonlySet<string> {
  const cached = cumulativeCache.get(grade);
  if (cached) return cached;

  const allowed = new Set<string>();
  for (let g = 1; g <= grade; g++) {
    const gradeSet = KANJI_SET_BY_GRADE[g as GradeLevel];
    for (const kanji of gradeSet) {
      allowed.add(kanji);
    }
  }

  cumulativeCache.set(grade, allowed);
  return allowed;
}
