import { KANJI_GRADE_1, KANJI_GRADE_1_SET } from "./grade1";
import { KANJI_GRADE_2, KANJI_GRADE_2_SET } from "./grade2";
import { KANJI_GRADE_3, KANJI_GRADE_3_SET } from "./grade3";
import { KANJI_GRADE_4, KANJI_GRADE_4_SET } from "./grade4";
import { KANJI_GRADE_5, KANJI_GRADE_5_SET } from "./grade5";
import { KANJI_GRADE_6, KANJI_GRADE_6_SET } from "./grade6";

export const KANJI_BY_GRADE = {
  1: KANJI_GRADE_1,
  2: KANJI_GRADE_2,
  3: KANJI_GRADE_3,
  4: KANJI_GRADE_4,
  5: KANJI_GRADE_5,
  6: KANJI_GRADE_6,
} as const;

export const KANJI_SET_BY_GRADE = {
  1: KANJI_GRADE_1_SET,
  2: KANJI_GRADE_2_SET,
  3: KANJI_GRADE_3_SET,
  4: KANJI_GRADE_4_SET,
  5: KANJI_GRADE_5_SET,
  6: KANJI_GRADE_6_SET,
} as const;

export type GradeLevel = keyof typeof KANJI_BY_GRADE;
