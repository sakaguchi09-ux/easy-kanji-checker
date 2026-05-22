import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: [{ url: "/~offline", revision: "1" }],
  globPublicPatterns: [
    "**/*.{ico,png,svg,webp,jpg,jpeg}",
    "kuromoji-dict/**/*.gz",
  ],
});

const nextConfig: NextConfig = {
  // Serwist は Webpack プラグインのため、本番ビルドで --webpack を使用
  turbopack: {},
};

export default withSerwist(nextConfig);
