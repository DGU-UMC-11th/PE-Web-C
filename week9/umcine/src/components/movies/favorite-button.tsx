"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useFavoritesQuery,
  useFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

interface FavoriteButtonProps {
  movieId: number;
  variant?: "icon" | "text";
  className?: string;
}

export function FavoriteButton({
  movieId,
  variant = "icon",
  className,
}: FavoriteButtonProps) {
  if (variant === "text") {
    return <FavoriteTextButton movieId={movieId} className={className} />;
  }
  return <FavoriteIconButton movieId={movieId} className={className} />;
}

// 영화 카드: 카드마다 요청하지 않고 내 즐겨찾기 목록 한 번으로 상태를 정해요.
function FavoriteIconButton({ movieId, className }: FavoriteButtonProps) {
  const favoritesQuery = useFavoritesQuery();
  const isFavorite =
    favoritesQuery.data?.some((favorite) => favorite.movieId === movieId) ??
    false;
  const { toggle, isPending } = useFavoriteToggle(movieId, isFavorite);
  const label = isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isFavorite}
      disabled={isPending}
      className={cn(
        "flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-none disabled:opacity-60",
        isFavorite ? "bg-blue-600" : "bg-black/60",
        className,
      )}
      onClick={toggle}
    >
      <Image
        className="invert"
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        width={16}
        height={16}
      />
    </button>
  );
}

// 영화 상세: GET /favorites/{movieId}로 이 영화의 즐겨찾기 여부를 조회해요.
function FavoriteTextButton({ movieId, className }: FavoriteButtonProps) {
  const statusQuery = useFavoriteStatusQuery(movieId);
  const isFavorite = statusQuery.data?.isFavorite ?? false;
  const { toggle, isPending } = useFavoriteToggle(movieId, isFavorite);

  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      disabled={isPending || statusQuery.isLoading}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold disabled:opacity-60",
        isFavorite ? "bg-white text-blue-600" : "bg-blue-600 text-white",
        className,
      )}
      onClick={toggle}
    >
      <Image
        className={cn(!isFavorite && "invert")}
        src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
        width={16}
        height={16}
      />
      {isPending ? "변경 중" : isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    </button>
  );
}

function useFavoriteToggle(movieId: number, isFavorite: boolean) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const toggleMutation = useToggleFavoriteMutation();

  function toggle() {
    if (!accessToken) {
      alert("즐겨찾기는 로그인 후에 사용할 수 있어요.");
      router.push("/login");
      return;
    }
    if (toggleMutation.isPending) return;
    toggleMutation.mutate({ movieId, isFavorite });
  }

  return { toggle, isPending: toggleMutation.isPending };
}
