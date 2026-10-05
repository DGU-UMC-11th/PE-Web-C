import { Link } from "@tanstack/react-router";

import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex min-w-0 flex-col gap-1">
      <div className="relative aspect-[241.6/274] w-full overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
        >
          <img
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={movie.title}
          />
        </Link>

        <button
          className={cn(
            "absolute right-2 top-[10px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border px-[6px] py-[7.5px]",
            movie.isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[#17191e]",
          )}
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="block h-[18px] w-[14px] brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap pt-[5px] text-[14px] font-extrabold leading-none text-[#17191e]">
        {movie.title}
      </h2>

      <p className="m-0 text-[12px] font-normal leading-none text-[#969da8]">
        {movie.releaseDate}
      </p>
    </article>
  );
}

export default MovieCard;
