/** カタカナ（全角・半角）をひらがなに変換 */
export function katakanaToHiragana(input: string): string {
  return input
    .replace(/[\u30a1-\u30f6]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0x60),
    )
    .replace(/[\uff66-\uff9d]/g, (char) =>
      String.fromCharCode(char.charCodeAt(0) - 0xff66 + 0x3041),
    );
}
