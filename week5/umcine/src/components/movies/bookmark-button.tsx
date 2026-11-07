import { useBookmarkStore, useIsBookmarked } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "label";
  className?: string;
}

// 목록 카드(icon), 검색 결과(icon), 상세 페이지(label) 어디서 눌러도 같은 store를 바꿔요.
export function BookmarkButton({
  movieId,
  movieTitle,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useIsBookmarked(movieId);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const label = isBookmarked
    ? `${movieTitle} 북마크 해제`
    : `${movieTitle} 북마크 추가`;

  const icon = (
    <span
      className={cn(
        "icon [--icon-url:url('/icons/bookmark-outline.svg')]",
        variant === "icon" ? "size-5" : "size-4 text-white",
        isBookmarked && "[--icon-url:url('/icons/bookmark.svg')]",
      )}
      aria-hidden="true"
    />
  );

  if (variant === "label") {
    return (
      <button
        type="button"
        aria-pressed={isBookmarked}
        aria-label={label}
        onClick={() => toggleBookmark(movieId)}
        className={cn(
          "flex h-[42px] items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-extrabold text-white",
          isBookmarked && "bg-ink",
          className,
        )}
      >
        {icon}
        {isBookmarked ? "북마크 해제" : "북마크 추가"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      aria-label={label}
      onClick={() => toggleBookmark(movieId)}
      className={cn(
        "grid size-[34px] place-items-center rounded-[10px] bg-badge text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-badge-hover active:scale-[0.92]",
        isBookmarked && "bg-accent hover:bg-accent",
        className,
      )}
    >
      {icon}
    </button>
  );
}
