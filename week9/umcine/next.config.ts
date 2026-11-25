import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // create-next-app 기본 설정
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // next/image로 TMDB 포스터를 불러오려면 이미지 서버를 허용 목록에 등록해야 해요.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" },
    ],
  },
};

export default nextConfig;
