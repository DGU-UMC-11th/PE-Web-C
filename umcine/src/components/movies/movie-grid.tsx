import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
  cardSize: "small" | "large";
}

function MovieGrid({ movies, onToggleBookmark, cardSize }: MovieGridProps) {
  return (
    <section
      className={cn(
        "grid w-full gap-x-[18px] gap-y-5",
        cardSize === "large"
          ? "grid-cols-1 min-[481px]:grid-cols-2 min-[769px]:grid-cols-3"
          : "grid-cols-1 min-[481px]:grid-cols-2 min-[769px]:grid-cols-3 min-[1025px]:grid-cols-5",
      )}
    >
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </section>
  );
}

export default MovieGrid;
