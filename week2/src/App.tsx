import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

const ITEMS_PER_PAGE = 10;

function App() {
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
      <Header />
      <main className="page-main">
        <h1 className="page-title">영화 목록</h1>
        <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </main>
      <footer className="footer">
        <div className="footer__inner">
          <img
            className="footer__logo"
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

export default App;
