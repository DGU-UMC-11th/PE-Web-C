import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>
        <BookmarkButton movieId={movie.id} className="absolute top-2 right-2" />
      </div>
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="no-underline"
      >
        <h3 className="truncate text-[15px] font-bold text-gray-900">
          {movie.title}
        </h3>
      </Link>
      <p className="text-[13px] text-gray-500">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;
