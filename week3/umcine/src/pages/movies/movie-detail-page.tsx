import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto flex max-w-[1440px] flex-1 items-center justify-center bg-page px-4 py-24 text-center text-muted sm:px-6 lg:px-20">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-page">
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px] lg:h-[360px]">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-20">
          <Link
            to="/"
            className="flex items-center gap-1 self-start text-[13px] font-bold text-white"
          >
            <span
              className="icon size-6 text-white [--icon-url:url('/icons/chevron-left.svg')]"
              aria-hidden="true"
            />
            영화 목록
          </Link>

          <div className="flex w-full max-w-[800px] flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-[-1.2px] text-white sm:text-[46px] sm:leading-[49.68px] sm:tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm text-white">{movie.originalTitle}</p>
            <div className="flex flex-wrap items-center gap-2 text-[13px] font-bold text-white">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 sm:px-6 lg:flex-row lg:px-20">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="h-[286px] w-[200px] shrink-0 self-center rounded-[10px] object-cover shadow-[0px_12px_30px_rgba(12,15,20,0.12)] lg:self-start"
        />

        <div className="flex flex-1 flex-col gap-3">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-ink">
            {movie.tagline}
          </h2>
          <p className="leading-6 text-secondary">{movie.overview}</p>

          <div>
            <BookmarkButton initialBookmarked={movie.isBookmarked} />
          </div>
        </div>

        <aside className="flex flex-col gap-2 border-border pb-10 lg:w-[360px] lg:border-l lg:pl-[30px]">
          <h2 className="text-[21px] font-bold tracking-[-0.63px] text-ink">
            내 평점
          </h2>
          <p className="text-xs text-muted">별점은 필수, 후기는 선택이에요.</p>

          <RatingStars />

          <textarea
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            rows={3}
            className="w-full resize-none rounded-lg border border-border px-3 py-4 text-[13px] text-ink outline-none placeholder:text-muted"
          />

          <button
            type="button"
            className="flex h-[42px] w-full items-center justify-center rounded-lg bg-ink text-sm font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}

function BookmarkButton({ initialBookmarked }: { initialBookmarked: boolean }) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  return (
    <button
      type="button"
      aria-pressed={isBookmarked}
      onClick={() => setIsBookmarked((current) => !current)}
      className={cn(
        "flex h-[42px] items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-extrabold text-white",
        isBookmarked && "bg-ink",
      )}
    >
      <span
        className={cn(
          "icon size-4 text-white [--icon-url:url('/icons/bookmark-outline.svg')]",
          isBookmarked && "[--icon-url:url('/icons/bookmark.svg')]",
        )}
        aria-hidden="true"
      />
      즐겨찾기
    </button>
  );
}

function RatingStars() {
  const [rating, setRating] = useState(0);

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="영화 별점">
      {[1, 2, 3, 4, 5].map((value) => {
        const isFilled = value <= rating;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${value}점`}
            onClick={() => setRating(value)}
            className="flex size-[38px] items-center justify-center rounded-lg border border-border bg-surface"
          >
            <span
              className={cn(
                "icon size-6 text-muted [--icon-url:url('/icons/star-outline.svg')]",
                isFilled && "text-accent [--icon-url:url('/icons/star.svg')]",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
