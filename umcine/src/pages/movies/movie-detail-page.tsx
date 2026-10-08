import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  const [isBookmarked, setIsBookmarked] = useState(movie?.isBookmarked ?? false);
  const [rating, setRating] = useState(0);

  if (!movie) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-32 text-center text-gray-500">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="pb-16">
      <section className="relative h-[460px] overflow-hidden bg-gray-900">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover object-top"
        />
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
            <p className="mt-2 text-base text-white/80">{movie.originalTitle}</p>
            <p className="mt-4 text-sm font-semibold text-white/90">
              {[movie.releaseDate, movie.genres.join(" · "), movie.runtime].join("  ·  ")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 pt-10 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6 sm:flex-row">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-[2/3] w-44 shrink-0 rounded-xl object-cover shadow-xl ring-1 ring-black/5"
          />
          <div className="pt-1">
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-gray-600">{movie.overview}</p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => setIsBookmarked((prev) => !prev)}
              className={cn(
                "mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                isBookmarked
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                className="size-4"
                fill={isBookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 3h12v18l-6-4-6 4z" />
              </svg>
              {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold">내 평점</h2>
          <p className="mt-1 text-xs text-gray-500">별점을 눌러 평가를 남겨보세요.</p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score}점`}
                aria-pressed={score <= rating}
                onClick={() => setRating(score)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg border text-xl transition-colors",
                  score <= rating
                    ? "border-yellow-400 bg-yellow-50 text-yellow-400"
                    : "border-gray-200 bg-white text-gray-300 hover:text-yellow-300",
                )}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="mt-4 h-28 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-gray-400 focus:bg-white"
          />
          <button
            type="button"
            className="mt-3 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}