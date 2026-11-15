import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/bookmark-button";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  useEffect(() => {
    setSearchText(query ?? "");
  }, [query]);

  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const searchResults = searchQuery.data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const searchForm = (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        aria-label="검색어"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="영화 제목을 입력하세요"
        className="flex-1 bg-transparent text-sm outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-700"
      >
        검색
      </button>
    </form>
  );

  if (!normalizedQuery) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32">
        <h1 className="mb-8 text-3xl font-bold">어떤 영화를 찾고 있나요?</h1>
        {searchForm}
        <p className="mt-4 text-sm text-gray-500">검색어를 입력해 주세요.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">영화 검색</h1>
      {searchForm}

      <div className="mb-2 mt-6 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">‘{query}’ 검색 결과</h2>
        <p className="text-xs text-gray-500">영화 {searchResults.length}편</p>
      </div>

      {searchQuery.isLoading ? (
        <p className="py-20 text-center text-sm text-gray-500">
          검색 결과를 불러오는 중이에요.
        </p>
      ) : searchQuery.isError ? (
        <p className="py-20 text-center text-sm text-gray-500">
          검색 결과를 불러오지 못했어요.
        </p>
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        <p className="py-20 text-center text-sm text-gray-500">
          검색 결과가 없어요.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {searchResults.map((movie) => (
            <li
              key={movie.id}
              className="flex gap-4 border-b border-gray-200 py-5"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={`${movie.title} 포스터`}
                  className="aspect-[2/3] w-20 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="aspect-[2/3] w-20 shrink-0 rounded-md bg-gray-200" />
              )}
              <div className="min-w-0">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {movie.original_title} · {movie.release_date}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {movie.overview}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    상세 보기 →
                  </Link>
                  <BookmarkButton movieId={movie.id} className="px-3 py-1" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
