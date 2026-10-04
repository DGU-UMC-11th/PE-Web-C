import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const ITEMS_PER_PAGE = 10;

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(movies.length / ITEMS_PER_PAGE));
  const pageMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <>
      <main className="mx-auto max-w-[1200px] px-6 pt-10 pb-20">
        <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>
        <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
