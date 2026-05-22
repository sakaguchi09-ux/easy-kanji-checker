# やさしい漢字チェッカー

小学校向けの学年別漢字変換 Web アプリ（Next.js + PWA）。

## 機能

- 学年別（小1〜小6）の未習漢字チェック
- やさしさ優先 / ふりがな表示のコピー用変換
- kuromoji によるローカル形態素解析（外部 AI 不使用）
- PWA 対応（オフライン利用・ホーム画面追加）

## 開発

```bash
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 本番ビルド

```bash
npm run build
npm start
```

PWA（Service Worker）は本番ビルド時のみ有効です。

## 技術スタック

- Next.js 16
- React 19
- Tailwind CSS 4
- kuromoji.js
- Serwist（PWA）
