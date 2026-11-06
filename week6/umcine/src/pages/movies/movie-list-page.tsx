import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 0, TMDB_MAX_PAGE);

  return (
    <>
      <main className="mx-auto max-w-[1200px] px-6 pt-10 pb-20">
        <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>
        {moviesQuery.isPending ? (
          <p className="text-gray-500">영화 목록을 불러오는 중이에요.</p>
        ) : moviesQuery.isError ? (
          <p className="text-red-600">영화 목록을 불러오지 못했어요.</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-500">조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
      <footer className="border-t border-gray-200 px-6 py-5">
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 text-xs text-gray-500">
          <img
            className="h-3.5"
            src="/images/logos/tmdb-logo.svg"
            alt="TMDB"
          />
          <span>
            This product uses the TMDB API but is not endorsed or certified
            by TMDB.
          </span>
        </div>
      </footer>
    </>
  );
}
