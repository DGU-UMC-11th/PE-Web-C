import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import {
  useFavoritesQuery,
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
} from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import type { MovieListItem } from "../../types/movie-list-item";
import { toMovieListItems } from "../../utils/movies/movie-adapter";

type CardSize = "small" | "large";

interface MovieListState {
  requestKey: string;
  movies: MovieListItem[];
  totalPages: number;
  errorMessage: string | null;
}

export function MovieListPage() {
  const { page: searchPage } = useSearch({
    from: "/",
  });

  const navigate = useNavigate({ from: "/" });
  const page = searchPage ?? 1;

  const [retryCount, setRetryCount] = useState(0);

  const [movieState, setMovieState] = useState<MovieListState>({
    requestKey: "",
    movies: [],
    totalPages: 1,
    errorMessage: null,
  });

  // 로그인 상태 확인
  const accessToken = useAuthStore((state) => state.accessToken);

  // 서버 즐겨찾기 조회 및 등록·삭제
  const favoritesQuery = useFavoritesQuery(Boolean(accessToken));

  const createFavoriteMutation = useCreateFavoriteMutation();

  const deleteFavoriteMutation = useDeleteFavoriteMutation();

  const bookmarkedMovieIds =
    favoritesQuery.data?.result.map((favorite) => favorite.movieId) ?? [];

  const isBookmarkPending =
    createFavoriteMutation.isPending || deleteFavoriteMutation.isPending;

  function handleToggleBookmark(movieId: number) {
    if (!accessToken) {
      void navigate({ to: "/login" });
      return;
    }

    if (
      favoritesQuery.isPending ||
      favoritesQuery.isError ||
      isBookmarkPending
    ) {
      if (favoritesQuery.isError) {
        alert("즐겨찾기 목록을 불러오지 못했어요.");
      }
      return;
    }

    const isBookmarked = bookmarkedMovieIds.includes(movieId);

    const mutation = isBookmarked
      ? deleteFavoriteMutation
      : createFavoriteMutation;

    mutation.mutate(movieId, {
      onError: () => {
        alert("즐겨찾기 변경에 실패했어요.");
      },
    });
  }

  const [cardSize, setCardSize] = useState<CardSize>(() => {
    try {
      return localStorage.getItem("umcine-card-size") === "large"
        ? "large"
        : "small";
    } catch {
      return "small";
    }
  });

  const requestKey = `${page}:${retryCount}`;

  useEffect(() => {
    let ignore = false;

    getMovies({ page })
      .then((response) => {
        if (!ignore) {
          setMovieState({
            requestKey,
            movies: toMovieListItems(response.results),
            totalPages: response.total_pages,
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setMovieState({
            requestKey,
            movies: [],
            totalPages: 1,
            errorMessage: "영화 목록을 불러오지 못했어요.",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [page, requestKey]);

  const isCurrentRequest = movieState.requestKey === requestKey;

  const isLoading = !isCurrentRequest;

  const movies = isCurrentRequest ? movieState.movies : [];

  const errorMessage = isCurrentRequest ? movieState.errorMessage : null;

  const totalPages = isCurrentRequest ? movieState.totalPages : 1;

  function handleRetry() {
    setRetryCount((current) => current + 1);
  }

  function handlePageChange(nextPage: number) {
    void navigate({
      search: nextPage === 1 ? {} : { page: nextPage },
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
            onToggleBookmark={handleToggleBookmark}
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
