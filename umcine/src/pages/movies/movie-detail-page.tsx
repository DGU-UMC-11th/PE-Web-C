import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getMe } from "../../api/members/me";
import { getFavoriteStatus } from "../../api/favorites/favorites";
import { getMemberRatings } from "../../api/ratings/ratings";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../../hooks/use-favorite-mutations";
import {
  useCreateRatingMutation,
  useDeleteRatingMutation,
  useUpdateRatingMutation,
} from "../../hooks/use-rating-mutations";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function formatRuntime(runtime: number | null) {
  if (typeof runtime !== "number") return "상영 시간 정보가 없어요.";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    staleTime: 30 * 1000,
  });

  const meQuery = useQuery({
    queryKey: ["members", "me"],
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const memberId = meQuery.data?.memberId;

  const favoriteStatusQuery = useQuery({
    queryKey: ["favorites", "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && isValidMovieId,
    retry: false,
  });
  const isFavorite = favoriteStatusQuery.data ?? false;

  const ratingsQuery = useQuery({
    queryKey: ["ratings", "member", memberId],
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== undefined,
  });
  const myRating = ratingsQuery.data?.find((r) => r.movieId === movieId);

  const addFavoriteMutation = useAddFavoriteMutation();
  const removeFavoriteMutation = useRemoveFavoriteMutation();
  const createRatingMutation = useCreateRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setScore(myRating?.score ?? 0);
    setComment(myRating?.comment ?? "");
  }, [myRating?.ratingId, myRating?.score, myRating?.comment]);

  const isFavoritePending =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;
  const isRatingPending =
    createRatingMutation.isPending ||
    updateRatingMutation.isPending ||
    deleteRatingMutation.isPending;

  const goLogin = () => {
    alert("로그인이 필요해요.");
    navigate({ to: "/login" });
  };

  const handleToggleFavorite = () => {
    if (!accessToken) return goLogin();
    if (isFavoritePending) return;
    if (isFavorite) removeFavoriteMutation.mutate(movieId);
    else addFavoriteMutation.mutate(movieId);
  };

  const handleSaveRating = () => {
    if (!accessToken) return goLogin();
    if (score < 1 || isRatingPending) return;
    const trimmed = comment.trim();
    const body = { score, comment: trimmed.length > 0 ? trimmed : undefined };

    if (myRating) {
      updateRatingMutation.mutate({ ratingId: myRating.ratingId, ...body });
    } else {
      createRatingMutation.mutate({ movieId, ...body });
    }
  };

  const handleDeleteRating = () => {
    if (!myRating || isRatingPending) return;
    deleteRatingMutation.mutate(myRating.ratingId);
  };

  if (!isValidMovieId) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-32 text-center text-gray-500">
        올바르지 않은 영화 번호예요.
      </main>
    );
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-32 text-center text-gray-500">
        영화 정보를 불러오는 중이에요.
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-32 text-center text-gray-500">
        {getMovieDetailErrorMessage(movieDetailQuery.error)}
      </main>
    );
  }

  const movie = movieDetailQuery.data;

  return (
    <main className="pb-16">
      <section className="relative h-[460px] overflow-hidden bg-gray-900">
        {movie.backdrop_path && (
          <img
            src={`${IMAGE_BASE_URL}/w1280${movie.backdrop_path}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 size-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-between px-6 pb-10 pt-6 text-white">
          <Link
            to="/"
            className="w-fit rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur hover:bg-white/25"
          >
            ‹ 영화 목록
          </Link>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">{movie.title}</h1>
            <p className="mt-2 text-base text-white/80">
              {movie.original_title}
            </p>
            <p className="mt-4 text-sm font-semibold text-white/90">
              {[
                movie.release_date,
                movie.genres.map((genre) => genre.name).join(", "),
                formatRuntime(movie.runtime),
              ].join("  ·  ")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6 sm:flex-row">
          {movie.poster_path ? (
            <img
              src={`${IMAGE_BASE_URL}/w500${movie.poster_path}`}
              alt={`${movie.title} 포스터`}
              className="aspect-[2/3] w-44 shrink-0 rounded-xl object-cover shadow-xl ring-1 ring-black/5"
            />
          ) : (
            <div className="aspect-[2/3] w-44 shrink-0 rounded-xl bg-gray-200" />
          )}
          <div className="pt-1">
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-gray-600">
              {movie.overview}
            </p>
            <button
              type="button"
              aria-pressed={isFavorite}
              disabled={isFavoritePending}
              onClick={handleToggleFavorite}
              className={cn(
                "mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60",
                isFavorite
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 3h12v18l-6-4-6 4z" />
              </svg>
              {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-500">
            {accessToken
              ? "별점을 눌러 평가를 남겨보세요."
              : "로그인하면 평점을 남길 수 있어요."}
          </p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value}점`}
                aria-pressed={value <= score}
                onClick={() => setScore(value)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors",
                  value <= score
                    ? "border-yellow-400 bg-yellow-50 text-yellow-400"
                    : "border-gray-200 bg-white text-gray-300 hover:text-yellow-300",
                )}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-28 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
          />
          <button
            type="button"
            disabled={score < 1 || isRatingPending}
            onClick={handleSaveRating}
            className="mt-3 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isRatingPending ? "저장 중" : myRating ? "평점 수정" : "평점 저장"}
          </button>
          {myRating && (
            <button
              type="button"
              disabled={isRatingPending}
              onClick={handleDeleteRating}
              className="mt-2 w-full rounded-lg border border-red-300 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              평점 삭제
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}
