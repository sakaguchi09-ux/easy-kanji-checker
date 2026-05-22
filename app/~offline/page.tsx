export default function OfflinePage() {
  return (
    <main className="flex min-h-full w-full items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">オフラインです</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">
          インターネットに接続していません。一度アプリを開いたあとであれば、ホーム画面から起動して使える場合があります。
        </p>
        <p className="mt-2 text-sm text-slate-500">
          接続が戻ったら、ページを再読み込みしてください。
        </p>
      </div>
    </main>
  );
}
