import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  // 뒤로 가기·앞으로 가기로 URL의 query가 바뀌면 입력창도 같은 값으로 맞춰요.
  // useEffect 안에서 setState를 호출하면 react-hooks/set-state-in-effect 린트 오류가 나서,
  // 렌더링 중에 이전 query와 비교해 state를 조정하는 방식으로 작성했어요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

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

      {!normalizedQuery ? (
        <p className="text-sm text-text-secondary">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-sm text-text-secondary">영화 {searchResults.length}편</p>
          </div>
          {searchResults.length === 0 ? (
            <p className="text-sm text-text-secondary">검색 결과가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-4 rounded-[10px] border border-border-default bg-bg-surface p-4"
                >
                  <img
                    className="h-[150px] w-[100px] shrink-0 rounded-lg object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-extrabold">{movie.title}</h3>
                      <BookmarkButton movieId={movie.id} title={movie.title} />
                    </div>
                    <p className="text-xs text-text-tertiary">{movie.originalTitle}</p>
                    <p className="text-xs text-text-tertiary">{movie.releaseDate}</p>
                    <p className="line-clamp-2 text-sm text-text-secondary">{movie.overview}</p>
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
