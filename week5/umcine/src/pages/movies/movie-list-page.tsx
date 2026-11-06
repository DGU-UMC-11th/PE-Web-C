import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: currentPage });
        if (!ignore) {
          setMovies(response.results);
          setTotalPages(Math.min(response.total_pages, TMDB_MAX_PAGE));
        }
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

  return (
    <>
      <main className="mx-auto max-w-[1200px] px-6 pt-10 pb-20">
        <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>
        {isLoading ? (
          <p className="text-gray-500">영화 목록을 불러오는 중이에요.</p>
        ) : errorMessage ? (
          <p className="text-red-600">{errorMessage}</p>
        ) : movies.length === 0 ? (
          <p className="text-gray-500">조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid movies={movies} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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
