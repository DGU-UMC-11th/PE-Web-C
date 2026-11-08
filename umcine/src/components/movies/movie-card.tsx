import { Link } from "@tanstack/react-router";

import type { MovieListItem } from "../../types/movie-list-item";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: MovieListItem;
  isBookmarked: boolean;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, isBookmarked, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="flex min-w-0 flex-col gap-1">
      <div className="relative aspect-[241.6/274] w-full overflow-hidden rounded-[10px] bg-[#e3e6eb]">
        <Link
          to="/movies/$movieId"
          params={{
            movieId: String(movie.id),
          }}
          className="block h-full w-full"
        >
          {movie.posterUrl ? (
            <img
              className="block h-full w-full object-cover"
              src={movie.posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[12px] font-bold text-[#969da8]">
              이미지 없음
            </div>
          )}
        </Link>

        <button
          className={cn(
            "absolute right-2 top-[10px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border px-[6px] py-[7.5px]",
            isBookmarked
              ? "border-[#2563eb] bg-[#2563eb]"
              : "border-white bg-[#17191e]",
          )}
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="block h-[18px] w-[14px] brightness-0 invert"
            src={
              isBookmarked
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
        {movie.releaseDate || "개봉일 정보 없음"}
      </p>
    </article>
  );
}

export default MovieCard;
