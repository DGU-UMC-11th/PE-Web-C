import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

import { movies } from "../../data/movies";

export function MovieListPage() {
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
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-['Pretendard'] text-[#17191e]">
      <main className="mx-auto box-border flex w-full max-w-[1440px] flex-1 flex-col gap-5 px-20 py-6 max-[480px]:p-5">
        <h1 className="m-0 text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
          영화 목록
        </h1>

        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />

        <Pagination />
      </main>
    </div>
  );
}
