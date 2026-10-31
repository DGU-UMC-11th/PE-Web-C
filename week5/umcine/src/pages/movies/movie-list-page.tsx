import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { EmptyState, ErrorState } from "../../components/common/async-state";
import MovieGrid from "../../components/movies/movie-grid";
import { MovieGridSkeleton } from "../../components/movies/movie-grid-skeleton";
import Pagination from "../../components/movies/pagination";

// TMDB는 500페이지까지 조회할 수 있지만, 화면에는 페이지 버튼을 5개만 보여줘요.
const VISIBLE_PAGES = 5;

export function MovieListPage() {
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const currentPage = page ?? 1;

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [totalPages, setTotalPages] = useState(VISIBLE_PAGES);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // 선택 미션: 이 값을 바꾸면 Effect가 다시 돌아 마지막 요청을 재실행해요.
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // 요청이 끝나기 전에 페이지를 떠나거나 page가 바뀌면
    // 늦게 도착한 이전 응답이 현재 상태를 덮어쓰지 않도록 막아요.
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });

        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, VISIBLE_PAGES));
        }
      } catch {
        if (!ignore) {
          setMovies([]);
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [currentPage, retryCount]);

  const handleChangePage = useCallback(
    (nextPage: number) => {
      navigate({ search: { page: nextPage === 1 ? undefined : nextPage } });
      window.scrollTo({ top: 0 });
    },
    [navigate],
  );

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-8 pb-16 sm:px-6 lg:px-20">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">영화 목록</h1>

      {/* 로딩 → 오류 → 빈 결과 → 성공 순서로 상태를 구분해요. */}
      {isLoading ? (
        <MovieGridSkeleton />
      ) : errorMessage ? (
        <ErrorState
          message={errorMessage}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      ) : movies.length === 0 ? (
        <EmptyState message="조건에 맞는 영화가 없어요." />
      ) : (
        <MovieGrid movies={movies} />
      )}

      {!errorMessage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={handleChangePage}
        />
      )}
    </main>
  );
}
