import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { EmptyState, ErrorState } from "../../components/common/async-state";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { MoviePoster } from "../../components/movies/movie-poster";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query?.trim() ?? "";

    setMovies([]);
    setErrorMessage(null);

    // 빈 검색어면 요청하지 않아요.
    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    // 검색어가 바뀌면 이전 Effect의 정리 함수가 먼저 실행돼요.
    // 이전 응답이 늦게 도착해도 현재 검색 결과를 덮어쓰지 않아요.
    return () => {
      ignore = true;
    };
  }, [query, retryCount]);

  function handleSearch(value: string) {
    navigate({ search: { query: value || undefined } });
  }

  if (!query?.trim()) {
    return (
      <main className="flex flex-1 flex-col items-center bg-page px-6 py-24 sm:px-[72px] sm:py-[150px] lg:py-[209px]">
        <div className="flex w-full max-w-[790px] flex-col items-center gap-9">
          <h1 className="text-center text-3xl font-bold tracking-[-1.5px] text-ink sm:text-[46px] sm:leading-[52.44px] sm:tracking-[-2.3px]">
            어떤 영화를 찾고 있나요?
          </h1>

          {/* query가 바뀔 때(뒤로가기 등) 입력값도 함께 리셋되도록 key로 리마운트해요 */}
          <EmptySearchForm key={query ?? ""} onSearch={handleSearch} />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-start bg-page px-4 py-6 sm:px-6 lg:px-20">
      <div className="flex w-full flex-col items-start gap-[17px]">
        <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-ink">
          영화 검색
        </h1>

        <ResultsSearchForm
          key={query ?? ""}
          initialValue={query ?? ""}
          onSearch={handleSearch}
        />
      </div>

      <div className="flex h-[54px] w-full flex-wrap items-center justify-between gap-2 border-y border-border">
        <h2 className="text-lg font-bold text-ink">
          &lsquo;{query}&rsquo; 검색 결과
        </h2>
        <span className="text-xs text-muted">
          {isLoading ? "불러오는 중" : `영화 ${movies.length}편`}
        </span>
      </div>

      {isLoading ? (
        <SearchResultSkeleton />
      ) : errorMessage ? (
        <ErrorState
          message={errorMessage}
          onRetry={() => setRetryCount((count) => count + 1)}
        />
      ) : movies.length === 0 ? (
        <EmptyState message="검색 결과가 없어요." />
      ) : (
        <ul className="grid w-full grid-cols-1 gap-x-10 sm:grid-cols-2">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-[18px] border-b border-border py-5"
            >
              <MoviePoster
                src={getTmdbPosterUrl(movie.poster_path)}
                alt={`${movie.title} 포스터`}
                className="h-[190px] w-[126px] shrink-0 overflow-hidden rounded-[10px] bg-page"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg leading-[24.3px] font-bold text-ink">
                    {movie.title}
                  </h3>
                  <BookmarkButton
                    movieId={movie.id}
                    movieTitle={movie.title}
                    className="shrink-0 bg-ink/70 hover:bg-ink"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{movie.original_title}</span>
                  <span>{formatReleaseDate(movie.release_date)}</span>
                </div>
                <p className="line-clamp-2 text-[12.5px] leading-[20.25px] text-secondary">
                  {movie.overview || "줄거리 정보가 없어요."}
                </p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="flex items-center gap-1 text-xs font-extrabold text-accent"
                >
                  상세 보기
                  <span
                    className="icon size-4 [--icon-url:url('/icons/arrow-right.svg')]"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function SearchResultSkeleton() {
  return (
    <ul
      className="grid w-full grid-cols-1 gap-x-10 sm:grid-cols-2"
      aria-label="검색 결과를 불러오는 중이에요."
      aria-busy="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <li
          key={index}
          className="flex animate-pulse gap-[18px] border-b border-border py-5"
        >
          <div className="h-[190px] w-[126px] shrink-0 rounded-[10px] bg-surface-hover" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="h-5 w-2/3 rounded bg-surface-hover" />
            <div className="h-3 w-1/3 rounded bg-surface-hover" />
            <div className="h-3 w-full rounded bg-surface-hover" />
            <div className="h-3 w-5/6 rounded bg-surface-hover" />
          </div>
        </li>
      ))}
    </ul>
  );
}

interface EmptySearchFormProps {
  onSearch: (value: string) => void;
}

function EmptySearchForm({ onSearch }: EmptySearchFormProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[74px] w-full items-center gap-3.5 rounded-xl border-2 border-ink bg-surface pr-[17px] pl-[21px] shadow-[0px_12px_17px_rgba(17,19,24,0.08)]"
    >
      <span
        className="icon size-6 text-ink [--icon-url:url('/icons/search.svg')]"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="예: 스파이더맨"
        aria-label="영화 검색어"
        className="min-w-0 flex-1 text-[17px] text-ink outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        className="flex h-[42px] shrink-0 items-center justify-center rounded-lg bg-ink px-4 text-sm font-extrabold text-white"
      >
        검색
      </button>
    </form>
  );
}

interface ResultsSearchFormProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

function ResultsSearchForm({ initialValue, onSearch }: ResultsSearchFormProps) {
  const [value, setValue] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[54px] w-full items-center gap-[18px] rounded-[9px] border border-border bg-surface pr-2.5 pl-[15px]"
    >
      <span
        className="icon size-6 text-ink [--icon-url:url('/icons/search.svg')]"
        aria-hidden="true"
      />
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="영화 검색어"
        className="min-w-0 flex-1 text-sm font-bold text-ink outline-none"
      />
      {value && (
        <button
          type="button"
          aria-label="검색어 지우기"
          onClick={() => setValue("")}
        >
          <span
            className="icon size-6 text-muted [--icon-url:url('/icons/close.svg')]"
            aria-hidden="true"
          />
        </button>
      )}
      <button
        type="submit"
        className="flex h-[42px] shrink-0 items-center justify-center rounded-lg bg-ink px-4 text-sm font-extrabold text-white"
      >
        다시 검색
      </button>
    </form>
  );
}
