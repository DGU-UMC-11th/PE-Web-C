import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieGrid, MovieGridSkeleton } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { StatusMessage } from "../../components/movies/status-message";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // 화면을 떠나거나 페이지가 바뀌면 true가 되어, 늦게 도착한 이전 응답이 state를 바꾸지 못해요.
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>

      {/* 로딩 → 오류 → 빈 결과 → 성공 순서로 구분해요. */}
      {isLoading ? (
        <MovieGridSkeleton />
      ) : errorMessage ? (
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
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
