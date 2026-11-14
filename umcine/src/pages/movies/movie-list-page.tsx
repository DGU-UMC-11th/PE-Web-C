import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { movieListQuery } from "../../api/movies/movie-queries";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { StatusMessage } from "../../components/movies/status-message";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // 5주차의 useEffect + movies/isLoading/errorMessage state를 useQuery 하나로 바꿨어요.
  // 요청, 로딩·오류 상태, 늦게 도착한 응답 무시, 캐시 재사용을 TanStack Query가 맡아요.
  const moviesQuery = useQuery(movieListQuery(currentPage));

  const movies = moviesQuery.data?.results ?? [];

  function handlePageChange(page: number) {
    // page가 바뀌면 queryKey도 바뀌어요. 그 페이지 캐시가 fresh면 요청 없이 바로 보여 줘요.
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>

      {/* isPending(첫 데이터 없음) → isError → 빈 결과 → 성공 순서로 구분해요. */}
      {moviesQuery.isPending ? (
        <MovieGridSkeleton />
      ) : moviesQuery.isError ? (
        <StatusMessage tone="error">영화 목록을 불러오지 못했어요.</StatusMessage>
      ) : movies.length === 0 ? (
        <StatusMessage>조건에 맞는 영화가 없어요.</StatusMessage>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
