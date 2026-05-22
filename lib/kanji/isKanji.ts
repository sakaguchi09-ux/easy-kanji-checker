/** 教育漢字チェック対象の漢字かどうか（簡易判定） */
export function isKanji(char: string): boolean {
  const code = char.codePointAt(0);
  if (code === undefined) return false;

  return (
    (code >= 0x4e00 && code <= 0x9fff) ||
    (code >= 0x3400 && code <= 0x4dbf)
  );
}
