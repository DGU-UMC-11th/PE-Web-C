import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
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
        <button
          type="button"
          className={cn(
            "absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-md border-none cursor-pointer",
            movie.isBookmarked ? "bg-blue-600" : "bg-black/60"
          )}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="h-4 w-4 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
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
