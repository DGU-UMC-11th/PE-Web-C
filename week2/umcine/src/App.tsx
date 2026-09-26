import { useState } from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./App.css";

const TOTAL_PAGES = 5;

export default function App() {
  // 영화 목록의 기준 값은 App 한 곳에서만 관리해요 (Single Source of Truth).
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
    <>
      <Header />

      <main className="page">
        <h1 className="page__title">영화 목록</h1>

        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />

        <Pagination
          currentPage={currentPage}
          totalPages={TOTAL_PAGES}
          onChangePage={setCurrentPage}
        />
      </main>

      <Footer />
    </>
  );
}
