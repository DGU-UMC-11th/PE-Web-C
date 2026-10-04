import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

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
      <main className="mx-auto box-border flex w-full max-w-[1440px] flex-col px-20 py-6">
        <div className="flex flex-col gap-[17px]">
          <h1 className="m-0 text-[38px] font-bold leading-[44px] tracking-[-1.71px] text-[#17191e]">
            영화 검색
          </h1>

          <form
            onSubmit={handleSubmit}
            className="box-border flex h-[54px] w-full items-center gap-[18px] rounded-[9px] border border-[#e3e6eb] bg-white pl-[15px] pr-[10px]"
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
              className="flex h-[42px] shrink-0 cursor-pointer items-center rounded-lg border border-white bg-[#17191e] px-4 text-[14px] font-extrabold leading-none text-white"
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
                영화 {searchResults.length}편
              </span>
            </div>

            {searchResults.length === 0 ? (
              <p className="py-10 text-center text-[14px] text-[#606774]">
                검색 결과가 없어요.
              </p>
            ) : (
              <div className="grid w-full grid-cols-2 gap-x-10">
                {searchResults.map((movie) => (
                  <article
                    key={movie.id}
                    className="box-border flex h-[240px] cursor-pointer gap-[18px] border-b border-[#e3e6eb] py-5"
                  >
                    <Link
                      to="/movies/$movieId"
                      params={{
                        movieId: String(movie.id),
                      }}
                      className="h-[190px] w-[126px] shrink-0 overflow-hidden rounded-[10px] bg-[#f6f7f9]"
                    >
                      <img
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                        className="block h-full w-full object-cover"
                      />
                    </Link>

                    <div className="box-border flex min-w-0 flex-1 flex-col gap-2 pb-[47.7px] pt-1">
                      <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-bold leading-6 text-[#17191e]">
                        {movie.title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-normal leading-none text-[#969da8]">
                          {movie.originalTitle}
                        </span>

                        <span className="text-[12px] text-[#969da8]">·</span>

                        <span className="text-[12px] font-normal leading-none text-[#969da8]">
                          {movie.releaseDate}
                        </span>
                      </div>

                      <p className="m-0 line-clamp-3 text-[12.5px] font-normal leading-5 text-[#606774]">
                        {movie.overview}
                      </p>

                      <Link
                        to="/movies/$movieId"
                        params={{
                          movieId: String(movie.id),
                        }}
                        className="flex items-center gap-1 self-start text-[12px] font-extrabold leading-none text-[#2563eb] no-underline"
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
