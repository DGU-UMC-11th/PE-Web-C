import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="relative flex flex-col gap-1">
      {/* 포스터와 제목을 하나의 Link로 감싸 카드에서 상세 화면으로 이동해요. */}
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(id) }}
        className="group flex flex-col gap-1"
      >
        <div className="h-[274px] overflow-hidden rounded-[10px] bg-bg-page">
          <img className="size-full object-cover" src={posterPath} alt={`${title} 포스터`} />
        </div>
        <div className="overflow-hidden pt-[5px] text-sm font-extrabold text-text-primary group-hover:underline">
          {title}
        </div>
      </Link>
      <div className="text-xs text-text-tertiary">{releaseDate}</div>

      {/* 버튼을 Link 밖에 두어 링크 안에 버튼이 중첩되지 않게 해요. */}
      <button
        type="button"
        className={cn(
          "absolute top-2.5 right-2.5 flex size-[34px] items-center justify-center rounded-lg border",
          isBookmarked
            ? "border-action-primary bg-action-primary"
            : "border-bg-surface bg-text-primary",
        )}
        aria-label={`${title} 북마크`}
        aria-pressed={isBookmarked}
        onClick={() => onToggleBookmark(id)}
      >
        {/* 제공된 아이콘 원본이 검정 단색이라 어두운 버튼 위에서 흰색으로 보이게 반전 */}
        <img
          className="brightness-0 invert"
          src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
          alt=""
          width={24}
          height={24}
        />
      </button>
    </article>
  );
}
