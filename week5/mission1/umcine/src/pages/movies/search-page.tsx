import { isHTTPError } from "ky";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

import { searchMovies } from "../../api/movies/search-movies";
import {
  toMovieCardData,
  type MovieCardData,
} from "../../adapters/movie-adapter";

import Pagination from "../../components/movies/pagination";
import { cn } from "../../utils/cn";

const PAGE_SIZE = 10;

function SearchForm({ query }: { query: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const hasQuery = Boolean(query.trim());

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    // 새로운 검색을 시작하면 페이지는 1로 초기화
    void navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-white px-4 sm:px-5",
        hasQuery
          ? "h-[54px] border-[#dfe2e7]"
          : "min-h-[74px] border-2 border-[#191b20] shadow-xl shadow-black/5"
      )}
    >
      <img
        className="size-6 shrink-0"
        src="/icons/search.svg"
        alt=""
      />

      <input
        type="search"
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        className={cn(
          "min-w-0 flex-1 bg-transparent py-3 text-sm placeholder:text-[#9a9fa8] focus-visible:outline-none",
          hasQuery && "font-bold"
        )}
      />

      {searchText && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => setSearchText("")}
          className="flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <img
            className="size-5"
            src="/icons/close.svg"
            alt=""
          />
        </button>
      )}

      <button
        type="submit"
        className="h-[42px] shrink-0 rounded-lg bg-[#191b20] px-4 text-sm font-bold text-white hover:bg-[#30333a]"
      >
        {hasQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );
}

export function SearchPage() {
  // 검색어와 페이지 번호를 URL에서 가져오기
  const { query, page } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const searchQuery = query?.trim() ?? "";
  const currentPage = page ?? 1;
  const apiPage = Math.ceil(currentPage / 2);

  // 검색 결과와 요청 상태
  const [searchResults, setSearchResults] =
    useState<MovieCardData[]>([]);

  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 다시 시도 버튼
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;

    setSearchResults([]);
    setTotalResults(0);
    setTotalPages(1);
    setErrorMessage(null);

    // 빈 검색어라면 API 호출하지 않음
    if (!searchQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    
    searchMovies({
      query: searchQuery,
      page: apiPage,
    })
      .then((response) => {
        if (ignore) return;

        const maxPage = Math.max(
          1,
          Math.ceil(
            Math.min(response.total_results, 10000) / PAGE_SIZE
          )
        );

        // 현재 페이지가 실제 검색 결과 범위를 벗어난 경우
        if (currentPage > maxPage) {
          void navigate({
            replace: true,
            search: {
              query: searchQuery,
              page: maxPage === 1 ? undefined : maxPage,
            },
          });
          return;
        }

        setSearchResults(
          response.results.map(toMovieCardData)
        );

        setTotalResults(response.total_results);
        setTotalPages(maxPage);
      })
      .catch((error: unknown) => {
        if (ignore) return;

        // API가 잘못된 페이지를 거부하는 경우
        if (
          apiPage > 1 &&
          isHTTPError(error) &&
          [400, 404, 422].includes(error.response.status)
        ) {
          void navigate({
            replace: true,
            search: {
              query: searchQuery,
            },
          });
          return;
        }

        setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [searchQuery, apiPage, currentPage, navigate, retryCount]);

  // 페이지 번호를 URL에 저장
  function handlePageChange(nextPage: number) {
    void navigate({
      search: {
        query: searchQuery,
        page: nextPage === 1 ? undefined : nextPage,
      },
    });
  }

  // TMDB 결과 20편을 10편씩 분리
  const pageOffset = ((currentPage - 1) % 2) * PAGE_SIZE;

  const visibleMovies = searchResults.slice(
    pageOffset,
    pageOffset + PAGE_SIZE
  );

  // 검색어가 없는 초기 화면
  if (!searchQuery) {
    return (
      <main className="mx-auto w-[calc(100%_-_32px)] max-w-[1280px] flex-1 pt-24 pb-20 sm:pt-[205px] min-[701px]:w-[calc(100%_-_160px)]">
        <h1 className="mb-10 text-center text-3xl font-extrabold tracking-[-1.5px] sm:text-[44px]">
          어떤 영화를 찾고 있나요?
        </h1>

        <div className="mx-auto max-w-[790px]">
          <SearchForm key={query ?? ""} query="" />
        </div>

        <p className="mt-5 text-center text-sm text-[#656a73]">
          검색어를 입력해 주세요.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[calc(100%_-_32px)] max-w-[1280px] flex-1 pt-6 pb-12 min-[701px]:w-[calc(100%_-_160px)]">
      <h1 className="mb-5 text-[32px] leading-[44px] font-extrabold tracking-[-1.3px] sm:text-4xl">
        영화 검색
      </h1>

      <SearchForm
        key={query ?? ""}
        query={searchQuery}
      />

      <div
        aria-live="polite"
        className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#dfe2e7] pb-4"
      >
        <h2 className="break-all text-lg font-bold">
          ‘{searchQuery}’ 검색 결과
        </h2>

        <p className="text-xs text-[#9a9fa8]">
          {isLoading
            ? "검색 중..."
            : errorMessage
              ? "검색 실패"
              : `영화 ${totalResults}편`}
        </p>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div role="status" className="py-24 text-center">
          <p className="text-lg font-bold">
            영화를 검색하는 중이에요.
          </p>
        </div>

      /* 오류 상태 */
      ) : errorMessage ? (
        <div role="alert" className="py-24 text-center">
          <p className="text-lg font-bold">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-5 rounded-lg bg-[#191b20] px-5 py-3 text-sm font-bold text-white"
          >
            다시 시도
          </button>
        </div>

      /* 빈 결과 상태 */
      ) : visibleMovies.length === 0 ? (
        <div role="status" className="py-24 text-center">
          <p className="text-lg font-bold">
            검색 결과가 없어요.
          </p>
          <p className="mt-2 text-sm text-[#656a73]">
            다른 제목이나 원제로 검색해 보세요.
          </p>
        </div>

      /* 성공 상태 */
      ) : (
        <>
          <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
            {visibleMovies.map((movie) => (
              <li
                key={movie.id}
                className="flex min-w-0 gap-4 border-b border-[#dfe2e7] py-5 sm:gap-[18px] sm:py-6"
              >
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="shrink-0 overflow-hidden rounded-[10px] bg-gray-200"
                >
                  {movie.posterUrl ? (
                    <img
                      className="h-[150px] w-[100px] object-cover sm:h-[190px] sm:w-[126px]"
                      src={movie.posterUrl}
                      alt={`${movie.title} 포스터`}
                    />
                  ) : (
                    <div className="flex h-[150px] w-[100px] items-center justify-center bg-gray-200 text-center text-xs text-gray-500 sm:h-[190px] sm:w-[126px]">
                      이미지 없음
                    </div>
                  )}
                </Link>

                <div className="flex min-w-0 flex-1 flex-col py-1">
                  <h3 className="text-base leading-6 font-bold sm:text-lg">
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="hover:text-blue-600"
                    >
                      {movie.title}
                    </Link>
                  </h3>

                  <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#9a9fa8]">
                    <span>{movie.originalTitle}</span>
                    <span>{movie.releaseDate}</span>
                  </p>

                  <p className="mt-3 line-clamp-3 break-words text-xs leading-[1.8] text-[#656a73]">
                    {movie.overview || "줄거리 정보가 없어요."}
                  </p>

                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-auto inline-flex w-fit items-center gap-1 pt-4 text-xs font-bold text-blue-600 hover:underline"
                  >
                    상세 보기
                    <img
                      className="size-4"
                      src="/icons/arrow-right.svg"
                      alt=""
                    />
                  </Link>
                </div>
              </li>
            ))}
          </ul>

          {/* 검색 결과 페이지네이션 */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </main>
  );
}
