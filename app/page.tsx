"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GradeLevel } from "@/data/kanji";
import {
  analyzeText,
  buildCopyText,
  type DisplayMode,
  useKuromoji,
} from "@/lib/kanji";

const GRADES = [
  { value: 1, label: "小1" },
  { value: 2, label: "小2" },
  { value: 3, label: "小3" },
  { value: 4, label: "小4" },
  { value: 5, label: "小5" },
  { value: 6, label: "小6" },
] as const;

type Grade = (typeof GRADES)[number]["value"];

const DISPLAY_MODES = [
  {
    value: "gentle" as const,
    label: "やさしさ優先",
    description: "未習漢字を含む単語をひらがなに変換",
  },
  {
    value: "furigana" as const,
    label: "ふりがな表示",
    description: "漢字を残し、読みを（）に表示",
  },
] as const;

const sectionCard =
  "min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6";

const statusBanner =
  "rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900 sm:px-4 sm:text-base";

const resultBox =
  "box-border min-h-32 w-full min-w-0 max-w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-3 text-base leading-relaxed break-words text-slate-900 sm:min-h-40 sm:px-4 sm:text-lg";

const textInput =
  "box-border w-full min-w-0 max-w-full resize-y rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-3 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 sm:px-4 sm:text-lg";

const actionButton =
  "inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl bg-sky-600 px-5 text-base font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-[7.5rem]";

function choiceButtonClass(selected: boolean, compact?: boolean): string {
  const base =
    "relative flex min-h-12 cursor-pointer rounded-xl border-2 transition-colors touch-manipulation";
  const layout = compact
    ? "flex-col items-center justify-center px-2 py-2 text-base font-semibold sm:text-lg"
    : "flex-col items-start justify-center px-3 py-3 sm:px-4";
  const state = selected
    ? "border-sky-600 bg-sky-600 text-white shadow-md ring-2 ring-sky-200"
    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100";
  return `${base} ${layout} ${state}`;
}

export default function Home() {
  const [grade, setGrade] = useState<Grade>(1);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("gentle");
  const [inputText, setInputText] = useState("");
  const [autoCopy, setAutoCopy] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const prevCopiedRef = useRef("");

  const { tokenizer, isReady, error: kuromojiError } = useKuromoji();
  const gradeLevel = grade as GradeLevel;

  const { segments, unlearnedKanji } = useMemo(
    () => analyzeText(inputText, gradeLevel),
    [inputText, gradeLevel],
  );

  const copyText = useMemo(() => {
    if (!inputText || !tokenizer) return "";
    return buildCopyText(inputText, gradeLevel, tokenizer, displayMode);
  }, [inputText, gradeLevel, tokenizer, displayMode]);

  useEffect(() => {
    if (!autoCopy || !copyText || copyText === prevCopiedRef.current) {
      return;
    }

    prevCopiedRef.current = copyText;

    void navigator.clipboard
      .writeText(copyText)
      .then(() => {
        setCopyStatus("copied");
        window.setTimeout(() => setCopyStatus("idle"), 2000);
      })
      .catch(() => {
        setCopyStatus("error");
        window.setTimeout(() => setCopyStatus("idle"), 2000);
      });
  }, [copyText, autoCopy]);

  const handleCopy = async () => {
    if (!copyText) return;

    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const copyPreview = () => {
    if (!inputText) {
      return (
        <p className="text-slate-400">
          未習漢字をひらがなに置き換えた文章が表示されます
        </p>
      );
    }
    if (kuromojiError) {
      return (
        <p className="text-red-600">
          辞書の読み込みに失敗しました。ページを再読み込みしてください。
        </p>
      );
    }
    if (!isReady || !tokenizer) {
      return <p className="text-slate-500">辞書を読み込み中…</p>;
    }
    return <p className="whitespace-pre-wrap break-words">{copyText}</p>;
  };

  return (
    <main className="min-h-full w-full min-w-0 overflow-x-hidden bg-slate-50">
      <div className="mx-auto box-border flex w-full min-w-0 max-w-3xl flex-col gap-5 px-3 py-5 sm:gap-6 sm:px-5 sm:py-8 md:gap-8 md:px-6 md:py-10">
        <header className="min-w-0 space-y-2 text-center sm:text-left">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl md:text-3xl">
            やさしい漢字チェッカー
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            選択した学年までに習う漢字以外を検出し、未習漢字をやさしい表記に変換します。
          </p>
        </header>

        <section className={sectionCard}>
          <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
            学年
          </h2>
          <p className={`${statusBanner} mb-3 sm:mb-4`}>
            <span className="block sm:inline">現在選択中：</span>
            <span className="font-bold sm:ml-1">小学{grade}年生</span>
          </p>
          <div
            className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 min-[560px]:grid-cols-6 min-[560px]:gap-3"
            role="radiogroup"
            aria-label="学年を選択"
          >
            {GRADES.map((g) => {
              const selected = grade === g.value;
              return (
                <label
                  key={g.value}
                  className={choiceButtonClass(selected, true)}
                >
                  <input
                    type="radio"
                    name="grade"
                    value={g.value}
                    checked={selected}
                    onChange={() => setGrade(g.value)}
                    className="sr-only"
                  />
                  {selected && (
                    <span className="mb-0.5 text-[0.65rem] font-normal opacity-90 sm:text-xs">
                      選択中
                    </span>
                  )}
                  {g.label}
                </label>
              );
            })}
          </div>

          <div className="mt-5 border-t border-slate-100 pt-5 sm:mt-6 sm:pt-6">
            <h2 className="mb-2 text-base font-semibold text-slate-800 sm:text-lg">
              表示モード
            </h2>
            <p className={`${statusBanner} mb-3 sm:mb-4`}>
              <span className="block sm:inline">現在選択中：</span>
              <span className="font-bold sm:ml-1">
                {DISPLAY_MODES.find((m) => m.value === displayMode)?.label}
              </span>
            </p>
            <div
              className="grid grid-cols-1 gap-2 min-[480px]:grid-cols-2 min-[480px]:gap-3"
              role="radiogroup"
              aria-label="表示モードを選択"
            >
              {DISPLAY_MODES.map((m) => {
                const selected = displayMode === m.value;
                return (
                  <label
                    key={m.value}
                    className={choiceButtonClass(selected)}
                  >
                    <input
                      type="radio"
                      name="displayMode"
                      value={m.value}
                      checked={selected}
                      onChange={() => setDisplayMode(m.value)}
                      className="sr-only"
                    />
                    {selected && (
                      <span className="mb-1 text-xs font-normal opacity-90">
                        選択中
                      </span>
                    )}
                    <span className="text-base font-semibold sm:text-lg">
                      {m.label}
                    </span>
                    <span
                      className={`mt-0.5 text-xs leading-snug sm:text-sm ${selected ? "text-sky-100" : "text-slate-500"}`}
                    >
                      {m.description}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        <section className={sectionCard}>
          <label
            htmlFor="input-text"
            className="mb-3 block text-base font-semibold text-slate-800 sm:text-lg"
          >
            変換したい文章
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="ここに文章を入力するか、貼り付けてください"
            rows={6}
            className={textInput}
          />
          <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
            入力すると、未習漢字のチェックとコピー用のやさしい表記を表示します。
          </p>
        </section>

        <section className={sectionCard}>
          <h2 className="mb-4 text-base font-semibold text-slate-800 sm:mb-6 sm:text-lg">
            変換結果
          </h2>

          <div className="space-y-5 sm:space-y-6">
            <div className="min-w-0">
              <h3 className="mb-3 text-sm font-semibold text-slate-700 sm:text-base">
                未習漢字チェック
              </h3>

              {unlearnedKanji.length > 0 && (
                <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs break-words text-amber-950 sm:px-4 sm:text-sm">
                  未習漢字（{unlearnedKanji.length}字）：
                  <span className="font-medium">{unlearnedKanji.join("、")}</span>
                </p>
              )}

              <div
                className={resultBox}
                aria-live="polite"
                aria-label="未習漢字チェック"
              >
                {inputText ? (
                  <p className="whitespace-pre-wrap break-words">
                    {segments.map((segment, index) =>
                      segment.highlighted ? (
                        <mark
                          key={index}
                          className="rounded bg-amber-200 px-0.5 text-amber-950 ring-1 ring-amber-300/80"
                          title="未習漢字"
                        >
                          {segment.text}
                        </mark>
                      ) : (
                        <span key={index}>{segment.text}</span>
                      ),
                    )}
                  </p>
                ) : (
                  <p className="text-slate-400">
                    未習漢字が黄色で表示されます
                  </p>
                )}
              </div>
            </div>

            <div className="min-w-0 border-t border-slate-100 pt-5 sm:pt-6">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold text-slate-700 sm:text-base">
                  コピー用文章
                </h3>
                <button
                  type="button"
                  onClick={() => void handleCopy()}
                  disabled={!copyText}
                  className={actionButton}
                >
                  {copyStatus === "copied"
                    ? "コピーしました"
                    : copyStatus === "error"
                      ? "コピーできませんでした"
                      : "コピー"}
                </button>
              </div>

              <div
                className={resultBox}
                aria-live="polite"
                aria-label="コピー用文章"
              >
                {copyPreview()}
              </div>
            </div>
          </div>

          <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 text-sm text-slate-700 sm:mt-6 sm:text-base">
            <input
              type="checkbox"
              checked={autoCopy}
              onChange={(e) => setAutoCopy(e.target.checked)}
              className="size-5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="min-w-0 leading-snug">変換後に自動コピーする</span>
          </label>
        </section>
      </div>
    </main>
  );
}
