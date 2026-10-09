import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="flex flex-col gap-2.5">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          <img
            className="aspect-[2/3] w-full rounded-xl bg-surface-hover object-cover"
            src={posterPath}
            alt={`${title} 포스터`}
            width={500}
            height={750}
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute top-2.5 right-2.5 grid size-[34px] place-items-center rounded-[10px] bg-badge text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-badge-hover active:scale-[0.92]",
            isBookmarked && "bg-accent hover:bg-accent",
          )}
          aria-pressed={isBookmarked}
          aria-label={
            isBookmarked ? `${title} 북마크 해제` : `${title} 북마크 추가`
          }
          onClick={() => onToggleBookmark(id)}
        >
          <span
            className={cn(
              "icon size-5 [--icon-url:url('/icons/bookmark-outline.svg')]",
              isBookmarked && "[--icon-url:url('/icons/bookmark.svg')]",
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          <h2
            className="overflow-hidden text-[15px] leading-[1.4] font-semibold whitespace-nowrap text-ellipsis"
            title={title}
          >
            {title}
          </h2>
        </Link>
        <p className="text-[13px] text-muted">{releaseDate}</p>
      </div>
    </article>
  );
}
