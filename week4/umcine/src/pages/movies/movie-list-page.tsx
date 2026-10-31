import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

const TOTAL_PAGES = 5;

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pt-8 pb-16 sm:px-6 lg:px-20">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">영화 목록</h1>

      {/* 북마크 상태는 각 카드가 Zustand store에서 직접 읽어요. */}
      <MovieGrid movies={movies} />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onChangePage={setCurrentPage}
      />
    </main>
  );
}
