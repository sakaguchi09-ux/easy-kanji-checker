import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "やさしい漢字チェッカー",
    short_name: "漢字チェッカー",
    description: "小学校向けの学年別漢字変換Webアプリ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    lang: "ja",
    background_color: "#f8fafc",
    theme_color: "#0284c7",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
