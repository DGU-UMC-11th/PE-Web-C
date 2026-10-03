import { useState } from "react";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

import { movies } from "./data/movies";
import type { Movie } from "./types/movie";

import "./styles/movie-page.css";

const MOVIES_PER_PAGE = 2;

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);
  const [currentPage, setCurrentPage] = useState(1);

  function handleToggleBookmark(movieId: number) {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? {
              ...movie,
              isBookmarked: !movie.isBookmarked,
            }
          : movie,
      ),
    );
  }

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;

  const currentMovies = movieList.slice(
    startIndex,
    startIndex + MOVIES_PER_PAGE,
  );

  return (
    <>
      <Header />

      <main className="main">
        <h1 className="page-title">영화 목록</h1>

        <MovieGrid
          movies={currentMovies}
          onToggleBookmark={handleToggleBookmark}
        />

        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </main>
    </>
  );
}