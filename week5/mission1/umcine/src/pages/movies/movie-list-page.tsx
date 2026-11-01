
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";

import {
  toMovieCardData,
  type MovieCardData,
} from "../../adapters/movie-adapter";

const PAGE_SIZE = 10;
const SORT_KEY = "umcine-sort-order";

function getSortOrder(): "title" | "default" {
  try {
    const savedSort = localStorage.getItem(SORT_KEY);

    if (savedSort === "title" || savedSort === "default") {
      return savedSort;
    }

    localStorage.setItem(SORT_KEY, "default");
  } catch {
    return "default";
  }

  return "default";
}

export function MovieListPage() {
  // URL에서 현재 페이지 읽기
  const { page } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const currentPage = page ?? 1;

  // TMDB는 한 페이지에 영화 20개 반환
  const apiPage = Math.ceil(currentPage / 2);

  // 영화 데이터 및 요청 상태
  const [movieList, setMovieList] = useState<MovieCardData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 다시 시도 버튼을 위한 상태
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: apiPage });

        if (!ignore) {
          // TMDB 데이터를 UI 타입으로 변환
          setMovieList(response.results.map(toMovieCardData));

          // 한 페이지에 10편씩 표시
          setTotalPages(
            Math.max(
              1,
              Math.ceil(
                Math.min(response.total_results, 10000) / PAGE_SIZE
              )
            )
          );
        }
      } catch {
        if (!ignore) {
          setErrorMessage("영화 목록을 불러오지 못했어요.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    void loadMovies();

    return () => {
      ignore = true;
    };
  }, [apiPage, retryCount]);

  // 기존 정렬 옵션 유지
  const sortOrder = getSortOrder();

  const sortedMovies =
    sortOrder === "title"
      ? [...movieList].sort((a, b) =>
          a.title.localeCompare(b.title, "ko")
        )
      : movieList;

  // TMDB의 20편을 10편씩 나누기
  const pageOffset = ((currentPage - 1) % 2) * PAGE_SIZE;

  const visibleMovies = sortedMovies.slice(
    pageOffset,
    pageOffset + PAGE_SIZE
  );

  // 페이지를 변경하면 URL도 변경
  function handlePageChange(nextPage: number) {
    void navigate({
      search: {
        page: nextPage === 1 ? undefined : nextPage,
      },
    });
  }

  return (
    <main className="mx-auto w-[calc(100%_-_32px)] max-w-[1280px] flex-1 pb-[54px] pt-6 min-[701px]:w-[calc(100%_-_160px)]">
      <h1 className="mb-5 text-[32px] leading-[44px] font-extrabold tracking-[-1.3px] sm:text-4xl">
        영화 목록
      </h1>

      {isLoading ? (
        <p role="status">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : errorMessage ? (
        <div role="alert" className="py-20 text-center">
          <p className="mb-4 text-lg font-bold">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="rounded-lg bg-[#191b20] px-5 py-3 text-sm font-bold text-white"
          >
            다시 시도
          </button>
        </div>
      ) : visibleMovies.length === 0 ? (
        <p>조건에 맞는 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={visibleMovies} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
