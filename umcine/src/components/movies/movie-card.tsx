import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

type MovieCardProps = {
  movie: Movie;
};

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article>
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-full rounded-lg object-cover"
          />
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute right-2 top-2" />
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2 truncate text-sm font-semibold">{movie.title}</h3>
      </Link>
      <p className="text-xs text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;
