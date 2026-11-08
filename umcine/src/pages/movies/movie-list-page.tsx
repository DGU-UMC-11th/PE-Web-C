import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { toMovieListItems } from "../../utils/movies/movie-adapter";

type CardSize = "small" | "large";

export function MovieListPage() {
  const { page: searchPage } = useSearch({
    from: "/",
  });

  const navigate = useNavigate({
    from: "/",
  });

  const page = searchPage ?? 1;

  // TanStack Query로 영화 목록 조회
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const isLoading = moviesQuery.isPending;

  const movies = moviesQuery.data
    ? toMovieListItems(moviesQuery.data.results)
    : [];

  const totalPages = moviesQuery.data?.total_pages ?? 1;

  const errorMessage = moviesQuery.isError
    ? "영화 목록을 불러오지 못했어요."
    : null;

  function handleRetry() {
    void moviesQuery.refetch();
  }

  // 북마크 상태 관리
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  // 카드 크기 상태 관리
  const [cardSize, setCardSize] = useState<CardSize>(() => {
    try {
      return localStorage.getItem("umcine-card-size") === "large"
        ? "large"
        : "small";
    } catch {
      return "small";
    }
  });

  function handlePageChange(nextPage: number) {
    navigate({
      search:
        nextPage === 1
          ? {}
          : {
              page: nextPage,
            },
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCardSizeChange(size: CardSize) {
    setCardSize(size);

    try {
      localStorage.setItem("umcine-card-size", size);
    } catch (error) {
      console.warn("카드 크기 저장에 실패했어요.", error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f7f9] font-['Pretendard'] text-[#17191e]">
      <main className="mx-auto box-border flex w-full max-w-[1440px] flex-1 flex-col gap-5 px-20 py-6 max-[480px]:p-5">
        <div className="flex items-center justify-between">
          <h1 className="m-0 text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
            영화 목록
          </h1>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleCardSizeChange("small")}
              aria-pressed={cardSize === "small"}
              className={`rounded-lg border px-3 py-2 text-[12px] font-bold ${
                cardSize === "small"
                  ? "border-[#17191e] bg-[#e3e6eb]"
                  : "border-[#e3e6eb] bg-white"
              }`}
            >
              작게
            </button>

            <button
              type="button"
              onClick={() => handleCardSizeChange("large")}
              aria-pressed={cardSize === "large"}
              className={`rounded-lg border px-3 py-2 text-[12px] font-bold ${
                cardSize === "large"
                  ? "border-[#17191e] bg-[#e3e6eb]"
                  : "border-[#e3e6eb] bg-white"
              }`}
            >
              크게
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-[14px] text-[#606774]">
            영화 목록을 불러오는 중이에요.
          </p>
        ) : errorMessage ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="m-0 text-[14px] text-red-500">{errorMessage}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="cursor-pointer rounded-lg border-none bg-[#17191e] px-4 py-3 text-[13px] font-bold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : movies.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-[#606774]">
            조건에 맞는 영화가 없어요.
          </p>
        ) : (
          <MovieGrid
            movies={movies}
            bookmarkedMovieIds={bookmarkedMovieIds}
            onToggleBookmark={toggleBookmark}
            cardSize={cardSize}
          />
        )}

        {!isLoading && !errorMessage && movies.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        <div className="mt-4 flex justify-center border-t border-[#e3e6eb] pt-6">
          <img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="h-5" />
        </div>
      </main>
    </div>
  );
}
