import { Link, useParams } from "@tanstack/react-router";

import { useEffect, useState } from "react";

import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

interface MovieDetailState {
  requestKey: string;
  movie: TmdbMovieDetail | null;
  errorMessage: string | null;
}

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

  const [detailState, setDetailState] = useState<MovieDetailState>({
    requestKey: "",
    movie: null,
    errorMessage: null,
  });

  const [retryCount, setRetryCount] = useState(0);

  const [rating, setRating] = useState(0);

  const [review, setReview] = useState("");

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const requestKey = `${parsedMovieId}:${retryCount}`;

  useEffect(() => {
    let ignore = false;

    if (!isValidMovieId) {
      return;
    }

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) {
          setDetailState({
            requestKey,
            movie: response,
            errorMessage: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setDetailState({
            requestKey,
            movie: null,
            errorMessage: getMovieDetailErrorMessage(error),
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId, requestKey]);

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

  const isCurrentRequest = detailState.requestKey === requestKey;

  const isLoading = !isCurrentRequest;

  const movie = isCurrentRequest ? detailState.movie : null;

  const errorMessage = isCurrentRequest ? detailState.errorMessage : null;

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
              onClick={() => setRetryCount((current) => current + 1)}
              className="cursor-pointer rounded-lg border-none bg-[#17191e] px-4 py-3 text-[13px] font-bold text-white"
            >
              다시 시도
            </button>
          )}
        </div>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

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
              onClick={() => toggleBookmark(movie.id)}
              className="flex h-[42px] cursor-pointer items-center gap-2 rounded-lg border border-white bg-[#2563eb] px-4 text-[14px] font-extrabold leading-none text-white"
            >
              <img
                src="/icons/bookmark.svg"
                alt=""
                className="block h-4 w-4 brightness-0 invert"
              />

              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
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

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star}점`}
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
            className="box-border h-[102px] w-full resize-none rounded-lg border border-[#e3e6eb] bg-white px-3 pb-[18px] pt-4 text-[13px] font-normal leading-[1.5] text-[#17191e] outline-none placeholder:text-[#969da8] focus:border-[#2563eb]"
          />

          <button
            id="save-rating"
            type="button"
            className="flex h-[42px] w-full cursor-pointer items-center justify-center rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-none text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
