import { useBookmarkStore, useIsBookmarked } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  title: string;
  className?: string;
}

export function BookmarkButton({ movieId, title, className }: BookmarkButtonProps) {
  const isBookmarked = useIsBookmarked(movieId);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={cn(
        "flex size-[34px] shrink-0 items-center justify-center rounded-lg border",
        isBookmarked
          ? "border-action-primary bg-action-primary"
          : "border-bg-surface bg-text-primary",
        className,
      )}
      aria-label={`${title} 북마크`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
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
  );
}
