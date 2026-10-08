import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <section
      aria-label="영화 목록"
      className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5"
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}