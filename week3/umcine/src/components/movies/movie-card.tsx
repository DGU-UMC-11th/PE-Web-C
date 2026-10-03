import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[9px] bg-[#dddddd] lg:aspect-auto lg:h-[274px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block h-full w-full">
          <img className="block h-full w-full object-cover" src={movie.posterPath} alt={movie.title + " 포스터"} />
        </Link>
        <button
          type="button"
          aria-label={movie.title + " 북마크"}
          aria-pressed={movie.isBookmarked}
          className={cn(
            "absolute right-[9px] top-[9px] flex size-[34px] items-center justify-center rounded-[7px] border p-0 transition-colors",
            movie.isBookmarked ? "border-blue-600 bg-blue-600" : "border-white/95 bg-[#131518]/90 hover:bg-[#131518]",
          )}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img className="h-[23px] w-[25px] brightness-0 invert" src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
        </button>
      </div>
      <div className="pt-[6px]">
        <h2 className="truncate text-[14px] font-black leading-[17px] text-[#25272c]">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
        </h2>
        <p className="mt-px text-[11px] leading-4 text-[#9a9fa8]">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
