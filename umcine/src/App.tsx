import { useState } from "react";
import "./App.css";

import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";

import { movies } from "./data/movies";

function App() {
  const [movieList, setMovieList] = useState(movies);

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
    <div className="page">
      <Header />

      <main className="main-container">
        <h1 className="page-title">영화 목록</h1>

        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

        <Pagination />
      </main>
    </div>
  );
}

export default App;
