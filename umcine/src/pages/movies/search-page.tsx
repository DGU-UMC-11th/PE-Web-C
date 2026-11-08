import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { StatusMessage } from "../../components/movies/status-message";
import { formatReleaseDate } from "../../utils/movies/format-movie";

interface SearchResult {
  query: string;
  movies: TmdbMovieListItem[];
  errorMessage: string | null;
}

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  // 뒤로 가기·앞으로 가기로 URL의 query가 바뀌면 입력창도 같은 값으로 맞춰요. (3주차)
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = (query ?? "").trim();

  // 응답을 "어떤 검색어의 결과인지"와 함께 저장해요.
  // 현재 검색어의 응답이 아직 없으면 로딩 중으로 계산하므로, Effect 안에서 setIsLoading(true)처럼
  // state를 바로 바꾸지 않아도 돼요. (react-hooks/set-state-in-effect 규칙)
  const [result, setResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    // 빈 검색어는 요청하지 않아요.
    if (!normalizedQuery) return;

    // 검색어가 바뀌면 이전 Effect의 정리 함수가 먼저 실행돼요.
    // 이전 검색 응답이 늦게 도착해도 현재 결과를 덮어쓰지 않아요.
    let ignore = false;

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) {
          setResult({ query: normalizedQuery, movies: response.results, errorMessage: null });
        }
      })
      .catch(() => {
        if (!ignore) {
          setResult({
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

  const isCurrentResult = result?.query === normalizedQuery;
  const isLoading = normalizedQuery !== "" && !isCurrentResult;
  const movies: TmdbMovieListItem[] = isCurrentResult ? result.movies : [];
  const errorMessage = isCurrentResult ? result.errorMessage : null;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 검색
      </h1>
      <form className="flex w-full max-w-xl gap-2" onSubmit={handleSubmit}>
        <input
          aria-label="검색어"
          placeholder="영화 제목을 입력해 주세요"
          className="h-[42px] min-w-0 flex-1 rounded-lg border border-border-default bg-bg-surface px-3 text-sm outline-none placeholder:text-text-tertiary focus:border-action-primary"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          type="submit"
          className="h-[42px] rounded-lg bg-action-primary px-4 text-sm font-extrabold text-bg-surface hover:bg-action-hover active:bg-action-pressed"
        >
          검색
        </button>
      </form>

      {/* 빈 검색어 → 로딩 → 오류 → 빈 결과 → 성공 순서로 구분해요. */}
      {!normalizedQuery ? (
        <StatusMessage>검색어를 입력해 주세요.</StatusMessage>
      ) : isLoading ? (
        <StatusMessage>‘{normalizedQuery}’ 검색 결과를 불러오는 중이에요.</StatusMessage>
      ) : errorMessage ? (
        <StatusMessage tone="error">{errorMessage}</StatusMessage>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold">‘{normalizedQuery}’ 검색 결과</h2>
            <p className="text-sm text-text-secondary">영화 {movies.length}편</p>
          </div>
          {movies.length === 0 ? (
            <StatusMessage>검색 결과가 없어요.</StatusMessage>
          ) : (
            <ul className="flex flex-col gap-4">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 rounded-[10px] border border-border-default bg-bg-surface p-4"
                >
                  <MoviePoster
                    posterPath={movie.poster_path}
                    title={movie.title}
                    className="h-[150px] w-[100px] shrink-0 rounded-lg"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-extrabold">{movie.title}</h3>
                      <BookmarkButton movieId={movie.id} title={movie.title} />
                    </div>
                    <p className="text-xs text-text-tertiary">{movie.original_title}</p>
                    <p className="text-xs text-text-tertiary">
                      {formatReleaseDate(movie.release_date)}
                    </p>
                    <p className="line-clamp-2 text-sm text-text-secondary">
                      {movie.overview || "줄거리 정보가 없어요."}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-auto text-sm font-bold text-action-primary hover:underline"
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
