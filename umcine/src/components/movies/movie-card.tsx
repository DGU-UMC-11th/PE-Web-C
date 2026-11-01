import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../bookmark-button";

type MovieCardProps = {
  movie: TmdbMovieListItem;
};

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article>
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              className="aspect-[2/3] w-full rounded-lg object-cover"
            />
          ) : (
            <div className="aspect-[2/3] w-full rounded-lg bg-gray-200" />
          )}
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2 truncate text-sm font-semibold">{movie.title}</h3>
      </Link>
      <p className="text-xs text-gray-400">{movie.release_date}</p>
    </article>
  );
}

export default MovieCard;
