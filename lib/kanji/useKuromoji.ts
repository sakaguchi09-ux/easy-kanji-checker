"use client";

import { useEffect, useState } from "react";
import { loadKuromojiTokenizer, type KuromojiTokenizer } from "./kuromojiLoader";

export function useKuromoji() {
  const [tokenizer, setTokenizer] = useState<KuromojiTokenizer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadKuromojiTokenizer()
      .then((instance) => {
        if (cancelled) return;
        setTokenizer(instance);
        setIsReady(true);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "辞書の読み込みに失敗しました");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { tokenizer, isReady, error };
}
