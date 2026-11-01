import type { TmdbMovieListItem } from "../../api/movies/models";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

const MOVIE_GRID_CLASS =
  "grid w-full grid-cols-1 gap-x-[18px] gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section className={MOVIE_GRID_CLASS}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}

// 로딩 중에는 같은 크기의 회색 카드(skeleton)를 보여 줘서 화면이 갑자기 밀리지 않게 해요.
export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <section className={MOVIE_GRID_CLASS} aria-busy="true" aria-label="영화 목록을 불러오는 중이에요.">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex animate-pulse flex-col gap-1">
          <div className="h-[274px] rounded-[10px] bg-border-default" />
          <div className="mt-[5px] h-4 w-3/4 rounded bg-border-default" />
          <div className="h-3 w-1/3 rounded bg-border-default" />
        </div>
      ))}
    </section>
  );
}
