import { useNavigate } from "@tanstack/react-router";
import { useFavoritesQuery, useToggleFavoriteMutation } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  movieTitle: string;
  variant?: "icon" | "label";
  /** 상세 화면처럼 단건 조회로 이미 알고 있으면 그 값을 넘겨요. */
  isFavorite?: boolean;
  className?: string;
}

/**
 * 4주차의 localStorage 북마크를 서버 즐겨찾기로 바꿨어요.
 * isFavorite을 넘기지 않으면 내 즐겨찾기 목록에서 찾아 판단해요.
 */
export function FavoriteButton({
  movieId,
  movieTitle,
  variant = "icon",
  isFavorite,
  className,
}: FavoriteButtonProps) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoritesQuery = useFavoritesQuery();
  const { toggle, isPending } = useToggleFavoriteMutation(movieId);

  const favorite =
    isFavorite ??
    Boolean(favoritesQuery.data?.some((item) => item.movieId === movieId));

  const label = favorite
    ? `${movieTitle} 즐겨찾기 해제`
    : `${movieTitle} 즐겨찾기 추가`;

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      navigate({ to: "/login" });
      return;
    }
    toggle(favorite);
  };

  const icon = (
    <span
      className={cn(
        "icon [--icon-url:url('/icons/bookmark-outline.svg')]",
        variant === "icon" ? "size-5" : "size-4 text-white",
        favorite && "[--icon-url:url('/icons/bookmark.svg')]",
      )}
      aria-hidden="true"
    />
  );

  if (variant === "label") {
    return (
      <button
        type="button"
        aria-pressed={favorite}
        aria-label={label}
        disabled={isPending}
        onClick={handleClick}
        className={cn(
          "flex h-[42px] items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-extrabold text-white disabled:bg-accent-disabled",
          favorite && "bg-ink",
          className,
        )}
      >
        {icon}
        {isPending ? "처리 중" : favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={label}
      disabled={isPending}
      onClick={handleClick}
      className={cn(
        "grid size-[34px] place-items-center rounded-[10px] bg-badge text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-badge-hover active:scale-[0.92] disabled:opacity-60",
        favorite && "bg-accent hover:bg-accent",
        className,
      )}
    >
      {icon}
    </button>
  );
}
