import { useState } from "react";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

import { movies } from "./data/movies";
import type { Movie } from "./types/movie";

import "./styles/movie-page.css";

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 10;

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;

  const currentMovies = movieList.slice(startIndex, endIndex);

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