import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const results = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSearch(value: string) {
    navigate({
      search: { query: value || undefined },
    });
  }

  if (!normalizedQuery) {
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
        <span className="text-xs text-muted">영화 {results.length}편</span>
      </div>

      {results.length === 0 ? (
        <p className="w-full py-24 text-center text-muted">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul className="grid w-full grid-cols-1 gap-x-10 sm:grid-cols-2">
          {results.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-[18px] border-b border-border py-5"
            >
              <div className="h-[190px] w-[126px] shrink-0 overflow-hidden rounded-[10px] bg-page">
                <img
                  src={movie.posterPath}
                  alt={`${movie.title} 포스터`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="text-lg leading-[24.3px] font-bold text-ink">
                  {movie.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>{movie.originalTitle}</span>
                  <span>{movie.releaseDate}</span>
                </div>
                <p className="line-clamp-2 text-[12.5px] leading-[20.25px] text-secondary">
                  {movie.overview}
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
