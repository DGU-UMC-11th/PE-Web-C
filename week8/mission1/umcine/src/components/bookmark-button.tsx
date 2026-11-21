import { Link } from "@tanstack/react-router";
import { useFavoriteMutation, useFavorites, useFavoriteStatus } from "../hooks/use-favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";
import { getMemberErrorMessage } from "../utils/get-member-error-message";

interface BookmarkButtonProps {
  movieId: number;
  variant?: "card" | "detail";
}

interface FavoriteControlProps {
  movieId: number;
  variant: "card" | "detail";
  isFavorite: boolean;
  isFetching: boolean;
  canRetry: boolean;
  onRetry: () => void;
}

function buttonClass(variant: "card" | "detail", isFavorite: boolean) {
  return cn(
    "inline-flex items-center justify-center rounded-lg text-sm font-bold text-white transition-colors disabled:cursor-wait disabled:opacity-60",
    variant === "detail"
      ? "mt-4 min-h-[42px] gap-2 px-4"
      : "absolute right-[9px] top-[9px] size-[34px] border",
    isFavorite ? "border-blue-600 bg-blue-700 hover:bg-blue-800" :
      variant === "detail" ? "bg-blue-600 hover:bg-blue-700" : "border-white/95 bg-[#131518]/90",
  );
}

function BookmarkIcon({ isFavorite }: { isFavorite: boolean }) {
  return (
    <img className="size-[18px] brightness-0 invert"
      src={isFavorite ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"} alt="" />
  );
}

function FavoriteControl({ movieId, variant, isFavorite, isFetching, canRetry, onRetry }: FavoriteControlProps) {
  const mutation = useFavoriteMutation(movieId);
  const isPending = mutation.isPending || isFetching;
  const label = canRetry ? "즐겨찾기 다시 조회" : isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가";
  const error = mutation.isError
    ? getMemberErrorMessage(mutation.error, "즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.")
    : "";

  function handleClick() {
    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken || isPending) return;
    if (canRetry) {
      onRetry();
      return;
    }
    mutation.mutate({ isFavorite, accessToken });
  }

  return (
    <>
      <button type="button" aria-label={label} aria-pressed={canRetry ? undefined : isFavorite}
        aria-busy={isPending} disabled={isPending} onClick={handleClick} className={buttonClass(variant, isFavorite)}>
        <BookmarkIcon isFavorite={isFavorite} />
        {variant === "detail" && (isPending ? "확인 중" : label)}
      </button>
      {error && <p role="alert" className={cn("rounded-md bg-red-50 p-2 text-xs text-red-700",
        variant === "detail" ? "mt-2" : "absolute inset-x-2 bottom-2")}>{error}</p>}
    </>
  );
}

function CardBookmarkButton({ movieId }: { movieId: number }) {
  const favorites = useFavorites();
  return (
    <FavoriteControl variant="card" movieId={movieId}
      isFavorite={favorites.data?.some((favorite) => favorite.movieId === movieId) ?? false}
      isFetching={favorites.isPending || favorites.isFetching} canRetry={favorites.isError} onRetry={() => void favorites.refetch()} />
  );
}

function DetailBookmarkButton({ movieId }: { movieId: number }) {
  const favorite = useFavoriteStatus(movieId);
  return (
    <FavoriteControl variant="detail" movieId={movieId} isFavorite={favorite.data ?? false}
      isFetching={favorite.isPending || favorite.isFetching} canRetry={favorite.isError} onRetry={() => void favorite.refetch()} />
  );
}

export function BookmarkButton({ movieId, variant = "card" }: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) {
    return (
      <Link to="/login" aria-label="로그인하고 즐겨찾기 추가" className={buttonClass(variant, false)}>
        <BookmarkIcon isFavorite={false} />
        {variant === "detail" && "로그인하고 즐겨찾기 추가"}
      </Link>
    );
  }

  return variant === "detail" ? <DetailBookmarkButton movieId={movieId} /> : <CardBookmarkButton movieId={movieId} />;
}
