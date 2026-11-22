import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HTTPError } from "ky";

import { movieQueries } from "../../api/movies/movie-queries";
import { useAuthStore } from "../../stores/auth-store";
import {
  useFavoritesQuery,
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
} from "../../hooks/use-favorites";
import { useCreateRatingMutation } from "../../hooks/use-create-rating-mutation";
import { useUpdateRatingMutation } from "../../hooks/use-update-rating-mutation";
import { useDeleteRatingMutation } from "../../hooks/use-delete-rating-mutation";
import { useMyRatingsQuery } from "../../hooks/use-my-ratings-query";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }

  if (minutes === 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);

  const movieDetailQuery = useQuery(movieQueries.detail(parsedMovieId));

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // 즐겨찾기 API
  const favoritesQuery = useFavoritesQuery(Boolean(accessToken));

  const createFavoriteMutation = useCreateFavoriteMutation();

  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  // 평점 등록 및 조회 API
  const createRatingMutation = useCreateRatingMutation();
  const updateRatingMutation = useUpdateRatingMutation();
  const deleteRatingMutation = useDeleteRatingMutation();

  const myRatingsQuery = useMyRatingsQuery(
    Boolean(accessToken) && isValidMovieId,
  );

  // 같은 영화에서 데이터가 다시 조회되어도
  // 사용자가 입력 중인 내용을 덮어쓰지 않도록 관리
  const hydratedMovieIdRef = useRef<number | null>(null);

  // 서버에서 저장된 내 평점을 불러와 입력창에 반영
  useEffect(() => {
    if (!isValidMovieId) {
      return;
    }

    if (!accessToken) {
      hydratedMovieIdRef.current = null;
      setRating(0);
      setReview("");
      return;
    }

    if (
      !myRatingsQuery.isSuccess ||
      hydratedMovieIdRef.current === parsedMovieId
    ) {
      return;
    }

    const savedRating = myRatingsQuery.data.result.content.find(
      (item) => item.movieId === parsedMovieId,
    );

    setRating(savedRating?.score ?? 0);
    setReview(savedRating?.comment ?? "");

    hydratedMovieIdRef.current = parsedMovieId;
  }, [
    accessToken,
    isValidMovieId,
    parsedMovieId,
    myRatingsQuery.isSuccess,
    myRatingsQuery.data,
  ]);

  const savedRating = myRatingsQuery.data?.result.content.find(
    (item) => item.movieId === parsedMovieId,
  );

  const isBookmarked =
    favoritesQuery.data?.result.some(
      (favorite) => favorite.movieId === parsedMovieId,
    ) ?? false;

  const isBookmarkPending =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  function handleBookmarkClick() {
    if (!accessToken) {
      void navigate({ to: "/login" });
      return;
    }

    if (
      favoritesQuery.isPending ||
      favoritesQuery.isError ||
      isBookmarkPending
    ) {
      return;
    }

    const mutation = isBookmarked
      ? deleteFavoriteMutation
      : createFavoriteMutation;

    mutation.mutate(parsedMovieId, {
      onError: () => {
        alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
      },
    });
  }

  function handleDeleteRating() {
    if (!accessToken || !savedRating) {
      return;
    }

    if (
      createRatingMutation.isPending ||
      updateRatingMutation.isPending ||
      deleteRatingMutation.isPending
    ) {
      return;
    }

    const confirmed = window.confirm("등록한 평점을 정말 삭제할까요?");

    if (!confirmed) {
      return;
    }

    deleteRatingMutation.mutate(savedRating.ratingId, {
      onSuccess: () => {
        setRating(0);
        setReview("");
        alert("평점이 삭제되었어요.");
      },
      onError: () => {
        alert("평점 삭제에 실패했어요.");
      },
    });
  }

  function handleSaveRating() {
    if (!accessToken) {
      alert("로그인이 필요한 기능이에요.");
      void navigate({ to: "/login" });
      return;
    }

    if (myRatingsQuery.isPending) {
      return;
    }

    if (myRatingsQuery.isError) {
      alert("평점 정보를 불러오지 못했어요. 다시 시도해 주세요.");
      return;
    }

    if (rating < 1 || rating > 5) {
      alert("별점을 1점 이상 선택해 주세요.");
      return;
    }

    if (createRatingMutation.isPending || updateRatingMutation.isPending) {
      return;
    }

    if (savedRating) {
      updateRatingMutation.mutate(
        {
          ratingId: savedRating.ratingId,
          score: rating,
          comment: review.trim(),
        },
        {
          onSuccess: () => {
            alert("평점이 수정되었어요.");
          },
          onError: () => {
            alert("평점 수정에 실패했어요.");
          },
        },
      );

      return;
    }

    createRatingMutation.mutate(
      {
        movieId: parsedMovieId,
        score: rating,
        comment: review.trim(),
      },
      {
        onSuccess: () => {
          alert("평점이 저장되었어요.");
        },
        onError: (error) => {
          if (error instanceof HTTPError && error.response.status === 409) {
            alert("이미 이 영화에 평점을 남기셨어요.");
            return;
          }

          alert("평점 저장에 실패했어요.");
        },
      },
    );
  }

  if (!isValidMovieId) {
    return (
      <main className="min-h-screen bg-[#f6f7f9]">
        <div className="mx-auto box-border w-full max-w-[1440px] px-20 py-10 max-[768px]:px-5">
          <p className="m-0 text-[16px] font-bold text-[#17191e]">
            올바르지 않은 영화 번호예요.
          </p>
        </div>
      </main>
    );
  }

  const isLoading = movieDetailQuery.isPending;
  const movie = movieDetailQuery.data ?? null;

  const errorMessage = movieDetailQuery.isError
    ? getMovieDetailErrorMessage(movieDetailQuery.error)
    : null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f6f7f9]">
        <div className="mx-auto box-border w-full max-w-[1440px] px-20 py-10 max-[768px]:px-5">
          <p className="m-0 text-[14px] text-[#606774]">
            영화 정보를 불러오는 중이에요.
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage || !movie) {
    return (
      <main className="min-h-screen bg-[#f6f7f9]">
        <div className="mx-auto box-border flex w-full max-w-[1440px] flex-col items-start gap-3 px-20 py-10 max-[768px]:px-5">
          <p className="m-0 text-[16px] font-bold text-[#17191e]">
            {errorMessage ?? "영화 정보를 불러오지 못했어요."}
          </p>

          {errorMessage !== "영화를 찾을 수 없어요." && (
            <button
              type="button"
              onClick={() => void movieDetailQuery.refetch()}
              className="cursor-pointer rounded-lg border-none bg-[#17191e] px-4 py-3 text-[13px] font-bold text-white"
            >
              다시 시도
            </button>
          )}
        </div>
      </main>
    );
  }

  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const genres = movie.genres.map((genre) => genre.name).join(" · ");

  const runtime = formatRuntime(movie.runtime);

  return (
    <main className="min-h-screen bg-[#f6f7f9] font-['Pretendard']">
      <section className="relative h-[360px] w-full overflow-hidden bg-[#17191e] max-[768px]:h-[300px]">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 block h-full w-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 mx-auto box-border flex h-full w-full max-w-[1440px] flex-col justify-between px-20 py-6 max-[768px]:px-5">
          <Link
            to="/"
            className="flex self-start items-center gap-1 text-[13px] font-bold leading-none text-white no-underline"
          >
            <span className="text-[24px] leading-none">←</span>
            영화 목록
          </Link>

          <div className="flex w-[800px] max-w-full flex-col gap-2">
            <h1 className="m-0 text-[46px] font-bold leading-[49.68px] tracking-[-2.3px] text-white max-[768px]:text-[34px] max-[768px]:leading-[40px]">
              {movie.title}
            </h1>

            <p className="m-0 text-[14px] font-normal leading-none text-white">
              {movie.original_title}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold leading-none text-white">
                {movie.release_date || "개봉일 정보 없음"}
              </span>

              {genres && (
                <>
                  <span className="text-[13px] font-bold leading-none text-white">
                    ·
                  </span>
                  <span className="text-[13px] font-bold leading-none text-white">
                    {genres}
                  </span>
                </>
              )}

              <span className="text-[13px] font-bold leading-none text-white">
                ·
              </span>

              <span className="text-[13px] font-bold leading-none text-white">
                {runtime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto box-border flex w-full max-w-[1440px] items-start gap-8 px-20 py-6 max-[768px]:flex-col max-[768px]:px-5">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-[#e3e6eb] shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="block h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[12px] font-bold text-[#969da8]">
              이미지 없음
            </div>
          )}
        </div>

        <section className="flex min-w-0 flex-1 flex-col gap-3">
          {movie.tagline && (
            <h2 className="m-0 text-[21px] font-bold leading-none tracking-[-0.63px] text-[#17191e]">
              {movie.tagline}
            </h2>
          )}

          <p className="m-0 text-[14px] font-normal leading-6 text-[#606774]">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>

          <div className="flex">
            <button
              type="button"
              onClick={handleBookmarkClick}
              disabled={
                Boolean(accessToken) &&
                (isBookmarkPending ||
                  favoritesQuery.isPending ||
                  favoritesQuery.isError)
              }
              className="flex h-[42px] cursor-pointer items-center gap-2 rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-extrabold leading-none text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <img
                src="/icons/bookmark.svg"
                alt=""
                className="block h-4 w-4 brightness-0 invert"
              />

              {isBookmarkPending
                ? "처리 중..."
                : isBookmarked
                  ? "즐겨찾기 해제"
                  : "즐겨찾기"}
            </button>
          </div>

          <div className="mt-4">
            <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-5" />
          </div>
        </section>

        <aside className="box-border flex w-[360px] shrink-0 flex-col gap-2 border-l border-[#e3e6eb] pb-[41px] pl-[30px] max-[768px]:w-full max-[768px]:border-l-0 max-[768px]:border-t max-[768px]:pb-0 max-[768px]:pl-0 max-[768px]:pt-6">
          <h2 className="m-0 text-[21px] font-bold leading-none tracking-[-0.63px] text-[#17191e]">
            내 평점
          </h2>

          <p className="m-0 text-[12px] font-normal leading-none text-[#969da8]">
            별점과 한줄평을 남겨보세요.
          </p>

          {accessToken && myRatingsQuery.isPending && (
            <p className="m-0 text-[12px] text-[#969da8]">
              저장된 평점을 불러오는 중이에요.
            </p>
          )}

          {accessToken && myRatingsQuery.isError && (
            <p className="m-0 text-[12px] text-red-500">
              저장된 평점을 불러오지 못했어요.
            </p>
          )}

          {savedRating && (
            <p className="m-0 text-[12px] font-bold text-[#2563eb]">
              저장된 평점이에요. 별점과 한줄평을 수정할 수 있어요.
            </p>
          )}

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
                aria-pressed={rating === star}
                onClick={() => setRating(star)}
                className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white px-[6px] py-px"
              >
                <span
                  className={
                    star <= rating
                      ? "text-[24px] leading-none text-[#2563eb]"
                      : "text-[24px] leading-none text-[#606774]"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          <textarea
            id="review-text"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            placeholder="이 영화에 대한 한줄평을 남겨주세요."
            className="box-border h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] font-normal leading-[1.5] text-[#17191e] outline-none placeholder:text-[#2563eb] focus:border-[#2563eb]"
          />

          <button
            id="save-rating"
            type="button"
            onClick={handleSaveRating}
            disabled={
              createRatingMutation.isPending ||
              updateRatingMutation.isPending ||
              (Boolean(accessToken) &&
                (myRatingsQuery.isPending || myRatingsQuery.isError))
            }
            className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-none text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createRatingMutation.isPending || updateRatingMutation.isPending
              ? "저장 중..."
              : savedRating
                ? "평점 수정"
                : "평점 저장"}
          </button>
          {savedRating && (
            <button
              type="button"
              onClick={handleDeleteRating}
              disabled={
                createRatingMutation.isPending ||
                updateRatingMutation.isPending ||
                deleteRatingMutation.isPending
              }
              className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border border-[#e3e6eb] bg-white px-4 text-[14px] font-extrabold text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteRatingMutation.isPending ? "삭제 중..." : "평점 삭제"}
            </button>
          )}
        </aside>
      </section>
    </main>
  );
}
