import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
}

export function BookmarkButton({
  movieId,
  variant = "icon",
  className,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const label = isBookmarked ? "북마크 해제" : "북마크 추가";
  const iconSrc = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  if (variant === "text") {
    return (
      <button
        type="button"
        aria-pressed={isBookmarked}
        className={cn(
          "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold cursor-pointer",
          isBookmarked
            ? "border border-blue-600 bg-white text-blue-600"
            : "border border-blue-600 bg-blue-600 text-white",
          className,
        )}
        onClick={() => toggleBookmark(movieId)}
      >
        <img
          className={cn("h-4 w-4", !isBookmarked && "invert")}
          src={iconSrc}
          alt=""
        />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isBookmarked}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md border-none cursor-pointer",
        isBookmarked ? "bg-blue-600" : "bg-black/60",
        className,
      )}
      onClick={() => toggleBookmark(movieId)}
    >
      <img className="h-4 w-4 invert" src={iconSrc} alt="" />
    </button>
  );
}
