import { useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/queries";
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

  // 5주차의 useEffect + useState 4개가 이 한 줄로 바뀌었어요.
  // 로딩/오류/데이터 상태와 캐시를 TanStack Query가 관리해요.
  const moviesQuery = useQuery(movieQueries.list(currentPage));

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? VISIBLE_PAGES,
    VISIBLE_PAGES,
  );

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
      {moviesQuery.isPending ? (
        <MovieGridSkeleton />
      ) : moviesQuery.isError ? (
        <ErrorState
          message="영화 목록을 불러오지 못했어요."
          onRetry={() => moviesQuery.refetch()}
        />
      ) : movies.length === 0 ? (
        <EmptyState message="조건에 맞는 영화가 없어요." />
      ) : (
        <MovieGrid movies={movies} />
      )}

      {!moviesQuery.isError && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={handleChangePage}
        />
      )}
    </main>
  );
}
