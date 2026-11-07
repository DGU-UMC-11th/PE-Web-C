
import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { MovieRating } from "../../components/movies/movie-rating";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

import {
  getTmdbPosterUrl,
  getTmdbBackdropUrl,
} from "../../utils/tmdb-image";

import { getMovieDetailErrorMessage } from "../../utils/get-movie-detail-error-message";

function formatRuntime(runtime: number | null) {
  if (runtime === null) {
    return "상영 시간 정보가 없어요.";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;

  return `${hours}시간 ${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const parsedMovieId = Number(movieId);

  const isValidMovieId =
    Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  // 영화 상세 데이터
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 다시 시도 버튼 상태
  const [retryCount, setRetryCount] = useState(0);

  // 기존 북마크 기능 유지
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(parsedMovieId)
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark
  );

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setErrorMessage("올바르지 않은 영화 번호예요.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) {
          setMovie(response);
        }
      })
      .catch((error: unknown) => {
        if (!ignore) {
          setErrorMessage(
            getMovieDetailErrorMessage(error)
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId, retryCount]);

  // 로딩 상태
  if (isLoading) {
    return (
      <main
        role="status"
        className="flex flex-1 items-center justify-center py-24"
      >
        <p className="text-lg font-bold">
          영화 정보를 불러오는 중이에요.
        </p>
      </main>
    );
  }

  // 오류 상태
  if (errorMessage || !movie) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-4 py-24">
        <h1 role="alert" className="text-xl font-bold">
          {errorMessage ?? "영화를 찾을 수 없어요."}
        </h1>

        {/* 유효한 영화 ID일 때만 다시 시도 */}
        {isValidMovieId && (
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="rounded-lg bg-[#191b20] px-5 py-3 text-sm font-bold text-white"
          >
            다시 시도
          </button>
        )}

        <Link
          to="/"
          className="text-sm font-bold text-blue-600 hover:underline"
        >
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  // TMDB 이미지 URL
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl =
    getTmdbBackdropUrl(movie.backdrop_path) ?? posterUrl;

  const genres =
    movie.genres.map((genre) => genre.name).join(" · ") ||
    "장르 정보 없음";

  return (
    <main className="flex-1">
      {/* 영화 배경 및 기본 정보 */}
      <section
        aria-labelledby="movie-title"
        className="relative isolate min-h-[360px] overflow-hidden bg-[#191b20] text-white"
      >
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 size-full object-cover object-center"
          />
        )}

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-black/60 via-black/20 to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-t from-black/50 to-transparent"
        />

        <div className="mx-auto flex min-h-[360px] w-[calc(100%_-_32px)] max-w-[1280px] flex-col justify-between gap-6 py-6 min-[701px]:w-[calc(100%_-_160px)]">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-xs font-bold hover:underline"
          >
            <img
              className="size-5 brightness-0 invert"
              src="/icons/chevron-left.svg"
              alt=""
            />
            영화 목록
          </Link>

          <div>
            <h1
              id="movie-title"
              className="mb-2 text-[30px] leading-tight font-extrabold tracking-[-1.3px] sm:text-[44px]"
            >
              {movie.title}
            </h1>

            <p className="mb-2 text-sm">
              {movie.original_title}
            </p>

            <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-bold">
              <span>
                {movie.release_date || "개봉일 정보 없음"}
              </span>
              <span>{genres}</span>
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 영화 소개 및 평점 */}
      <div className="mx-auto grid w-[calc(100%_-_32px)] max-w-[1280px] gap-6 py-6 pb-12 min-[701px]:w-[calc(100%_-_160px)] lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-[30px]">
        <section
          aria-labelledby="overview-title"
          className="flex min-w-0 items-start gap-5 sm:gap-8"
        >
          {posterUrl ? (
            <img
              className="aspect-[2/3] w-[100px] shrink-0 rounded-[10px] object-cover shadow-xl shadow-black/10 sm:w-[200px]"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex aspect-[2/3] w-[100px] shrink-0 items-center justify-center rounded-[10px] bg-gray-200 text-center text-xs text-gray-500 sm:w-[200px]">
              이미지 없음
            </div>
          )}

          <div className="min-w-0">
            <h2
              id="overview-title"
              className="mb-3 text-lg leading-[1.4] font-extrabold tracking-[-0.6px] sm:text-xl"
            >
              {movie.tagline || "줄거리"}
            </h2>

            <p className="text-sm leading-[1.85] text-[#656a73]">
              {movie.overview || "줄거리 정보가 없어요."}
            </p>

            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(movie.id)}
              className={cn(
                "mt-4 inline-flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition-colors",
                isBookmarked
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <img
                className="size-[18px] brightness-0 invert"
                src={
                  isBookmarked
                    ? "/icons/bookmark.svg"
                    : "/icons/bookmark-outline.svg"
                }
                alt=""
              />

              {isBookmarked
                ? "즐겨찾기 해제"
                : "즐겨찾기"}
            </button>
          </div>
        </section>

        {/* 기존 별점 및 후기 기능 */}
        <MovieRating
          key={movie.id}
          movieId={movie.id}
        />
      </div>
    </main>
  );
}
