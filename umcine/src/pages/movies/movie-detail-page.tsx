import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";

import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({
    from: "/movies/$movieId",
  });

  const movie = movies.find((item) => item.id === Number(movieId));

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const isBookmarked = movie ? bookmarkedMovieIds.includes(movie.id) : false;

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#f6f7f9]">
        <div className="mx-auto box-border w-full max-w-[1440px] px-20 py-6 max-[768px]:px-5">
          <p className="m-0 text-[16px] font-bold text-[#17191e]">
            영화를 찾을 수 없어요.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] font-['Pretendard']">
      <section className="relative h-[360px] w-full overflow-hidden max-[768px]:h-[300px]">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block h-full w-full object-cover"
        />

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
              {movie.originalTitle}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold leading-none text-white">
                {movie.releaseDate}
              </span>

              <span className="text-[13px] font-bold leading-none text-white">
                ·
              </span>

              <span className="text-[13px] font-bold leading-none text-white">
                {movie.genres.join(" · ")}
              </span>

              <span className="text-[13px] font-bold leading-none text-white">
                ·
              </span>

              <span className="text-[13px] font-bold leading-none text-white">
                {movie.runtime}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto box-border flex w-full max-w-[1440px] items-start gap-8 px-20 py-6 max-[768px]:flex-col max-[768px]:px-5">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-[#f6f7f9] shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="block h-full w-full object-cover"
          />
        </div>

        <section className="flex min-w-0 flex-1 flex-col gap-3">
          <h2 className="m-0 text-[21px] font-bold leading-none tracking-[-0.63px] text-[#17191e]">
            {movie.tagline}
          </h2>

          <p className="m-0 text-[14px] font-normal leading-6 text-[#606774]">
            {movie.overview}
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
