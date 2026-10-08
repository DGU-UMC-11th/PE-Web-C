import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

type MovieCardProps = {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
};

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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
        <button
          type="button"
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
          className={cn(
            "absolute right-2 top-2 rounded-full p-2 text-xs text-white",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60",
          )}
        >
          북마크
        </button>
      </div>
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <h3 className="mt-2 truncate text-sm font-semibold">{movie.title}</h3>
      </Link>
      <p className="text-xs text-gray-400">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;