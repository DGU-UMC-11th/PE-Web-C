import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import { useEffect, useState, type SubmitEvent } from "react";

import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

interface SearchResultState {
  query: string;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

export function SearchPage() {
  const { query } = useSearch({
    from: "/search",
  });

  const navigate = useNavigate({
    from: "/search",
  });

  const [searchText, setSearchText] = useState(query ?? "");

  const [searchResult, setSearchResult] = useState<SearchResultState>({
    query: "",
    movies: [],
    errorMessage: null,
  });

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const normalizedQuery = query?.trim() ?? "";

  useEffect(() => {
    let ignore = false;

    if (!normalizedQuery) {
      return;
    }

    searchMovies({
      query: normalizedQuery,
    })
      .then((response) => {
        if (!ignore) {
          setSearchResult({
            query: normalizedQuery,
            movies: response.results,
            errorMessage: null,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setSearchResult({
            query: normalizedQuery,
            movies: [],
            errorMessage: "검색 결과를 불러오지 못했어요.",
          });
        }
      });

    return () => {
      ignore = true;
    };
  }, [normalizedQuery]);

  const isCurrentQuery = searchResult.query === normalizedQuery;

  const movies = isCurrentQuery ? searchResult.movies : [];

  const errorMessage = isCurrentQuery ? searchResult.errorMessage : null;

  const isLoading = normalizedQuery !== "" && !isCurrentQuery;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handleClear() {
    setSearchText("");
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] font-['Pretendard']">
      <main className="mx-auto box-border flex w-full max-w-[1440px] flex-col px-20 py-6 max-[768px]:px-5">
        <div className="flex flex-col gap-[17px]">
          <h1 className="m-0 text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e] max-[768px]:text-[30px]">
            영화 검색
          </h1>

          <form
            onSubmit={handleSubmit}
            className="box-border flex h-[54px] w-full items-center gap-[18px] rounded-[9px] border border-[#e3e6eb] bg-white pl-[15px] pr-[10px] max-[480px]:gap-2"
          >
            <img
              src="/icons/search.svg"
              alt=""
              className="block h-6 w-6 shrink-0"
            />

            <input
              aria-label="검색어"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="영화 제목을 검색해 주세요."
              className="min-w-0 flex-1 border-none bg-transparent px-0.5 py-px text-[14px] font-bold leading-none text-[#17191e] outline-none placeholder:font-normal placeholder:text-[#969da8]"
            />

            {searchText && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={handleClear}
                className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center border-none bg-transparent p-0 text-[22px] leading-none text-[#969da8]"
              >
                ×
              </button>
            )}

            <button
              type="submit"
              className="flex h-[42px] shrink-0 cursor-pointer items-center whitespace-nowrap rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-none text-white max-[480px]:px-3 max-[480px]:text-[12px]"
            >
              다시 검색
            </button>
          </form>
        </div>

        {!normalizedQuery ? (
          <p className="mt-6 text-[14px] text-[#606774]">
            검색어를 입력해 주세요.
          </p>
        ) : (
          <>
            <div className="mt-6 flex h-[54px] w-full items-center justify-between border-y border-[#e3e6eb]">
              <h2 className="m-0 text-[18px] font-bold leading-none text-[#17191e]">
                ‘{query}’ 검색 결과
              </h2>

              <span className="text-[12px] font-normal leading-none text-[#969da8]">
                영화 {movies.length}편
              </span>
            </div>

            {isLoading ? (
              <p className="py-10 text-center text-[14px] text-[#606774]">
                검색 결과를 불러오는 중이에요.
              </p>
            ) : errorMessage ? (
              <p className="py-10 text-center text-[14px] text-red-500">
                {errorMessage}
              </p>
            ) : movies.length === 0 ? (
              <p className="py-10 text-center text-[14px] text-[#606774]">
                검색 결과가 없어요.
              </p>
            ) : (
              <div className="grid w-full grid-cols-1 gap-x-10 min-[769px]:grid-cols-2">
                {movies.map((movie) => {
                  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

                  const posterUrl = getTmdbPosterUrl(movie.poster_path);

                  return (
                    <article
                      key={movie.id}
                      className="box-border flex min-h-[240px] gap-[18px] border-b border-[#e3e6eb] py-5 max-[480px]:gap-3"
                    >
                      <Link
                        to="/movies/$movieId"
                        params={{
                          movieId: String(movie.id),
                        }}
                        className="h-[190px] w-[126px] shrink-0 overflow-hidden rounded-[10px] bg-[#e3e6eb] max-[480px]:h-[150px] max-[480px]:w-[100px]"
                      >
                        {posterUrl ? (
                          <img
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                            className="block h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[11px] font-bold text-[#969da8]">
                            이미지 없음
                          </div>
                        )}
                      </Link>

                      <div className="box-border flex min-w-0 flex-1 flex-col gap-2 pt-1">
                        <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-bold leading-6 text-[#17191e]">
                          {movie.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[12px] font-normal leading-none text-[#969da8]">
                            {movie.original_title}
                          </span>

                          <span className="text-[12px] text-[#969da8]">·</span>

                          <span className="text-[12px] font-normal leading-none text-[#969da8]">
                            {movie.release_date || "개봉일 정보 없음"}
                          </span>
                        </div>

                        <p className="m-0 line-clamp-3 text-[12.5px] font-normal leading-5 text-[#606774]">
                          {movie.overview || "줄거리 정보가 없어요."}
                        </p>

                        <div className="mt-auto flex items-center gap-3">
                          <Link
                            to="/movies/$movieId"
                            params={{
                              movieId: String(movie.id),
                            }}
                            className="flex items-center gap-1 self-start text-[12px] font-extrabold leading-none text-[#2563eb] no-underline"
                          >
                            상세 보기 →
                          </Link>

                          <button
                            type="button"
                            onClick={() => toggleBookmark(movie.id)}
                            className="cursor-pointer border-none bg-transparent p-0 text-[12px] font-extrabold text-[#2563eb]"
                          >
                            {isBookmarked ? "북마크 해제" : "북마크 추가"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <img
                src="/images/logos/tmdb-logo.svg"
                alt="TMDB"
                className="h-5"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
