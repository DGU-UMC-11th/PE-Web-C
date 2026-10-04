import { useState } from "react";
import { movies as initialMovies } from "../../data/movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);

  const toggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination />
    </main>
  );
}