import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useMovieBookmarks } from "../../hooks/use-movie-bookmarks";

const PAGE_SIZE = 10;

export function MovieListPage() {
  const { movieList, toggleBookmark } = useMovieBookmarks();
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(movieList.length / PAGE_SIZE));
  const visibleMovies = movieList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main className="mx-auto w-[calc(100%_-_32px)] max-w-[1280px] flex-1 pb-[54px] pt-6 min-[701px]:w-[calc(100%_-_160px)]">
      <h1 className="mb-5 text-[32px] leading-[44px] font-extrabold tracking-[-1.3px] sm:text-4xl">영화 목록</h1>
      <MovieGrid movies={visibleMovies} onToggleBookmark={toggleBookmark} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </main>
  );
}
