import type kuromoji from "kuromoji";

export type KuromojiTokenizer = kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

const DIC_PATH = "/kuromoji-dict";

let loadPromise: Promise<KuromojiTokenizer> | null = null;

/** kuromoji 辞書をローカル（public）から読み込む（シングルトン） */
export function loadKuromojiTokenizer(): Promise<KuromojiTokenizer> {
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    void import("kuromoji").then((mod) => {
      mod.default.builder({ dicPath: DIC_PATH }).build((err, tokenizer) => {
        if (err) {
          loadPromise = null;
          reject(err);
          return;
        }
        resolve(tokenizer);
      });
    });
  });

  return loadPromise;
}
