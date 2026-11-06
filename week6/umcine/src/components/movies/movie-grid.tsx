import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovieListItem[];
}

function MovieGrid({ movies }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieGrid;
