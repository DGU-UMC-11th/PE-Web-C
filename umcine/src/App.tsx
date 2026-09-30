import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import SiteFooter from "./components/site-footer";
import type { Movie } from "./types/movie";
import { movies as initialMovies } from "./data/movies";
import "./app.css";

const TOTAL_PAGES = 5;

export default function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="app__container">
        <h1 className="app__title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onPageChange={setCurrentPage}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
