import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "../../views/movies/search-page";

export const metadata: Metadata = { title: "영화 검색" };

// SearchPage는 useSearchParams로 ?query=를 읽어요. 요청을 받아야 알 수 있는 값이라 Suspense 경계 안에 둬요.
export default function Search() {
  return (
    <Suspense
      fallback={<main className="p-10">검색 화면을 준비하는 중이에요.</main>}
    >
      <SearchPage />
    </Suspense>
  );
}
