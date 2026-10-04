import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  // 영화 목록의 기준 값은 이 페이지 한 곳에서만 관리해요 (Single Source of Truth).
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  // 원본 배열을 직접 바꾸지 않고, map으로 새 배열과 새 객체를 만들어요.
  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-8 pb-16 sm:px-6 lg:px-20">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">영화 목록</h1>

      <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onChangePage={setCurrentPage}
      />
    </main>
  );
}
