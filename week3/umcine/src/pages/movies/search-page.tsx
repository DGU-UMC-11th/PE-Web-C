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
          movie.originalTitle.toLowerCase().includes(normalizedQuery)
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
    <main className="mx-auto max-w-[1200px] px-6 pt-10 pb-20">
      <h1 className="text-2xl font-bold">영화 검색</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
        <input
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="영화 제목을 검색해 보세요"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md border-none bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="mt-10 text-gray-500">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <h2 className="mt-10 text-lg font-bold">
            &lsquo;{query}&rsquo; 검색 결과
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            영화 {searchResults.length}편
          </p>
          {searchResults.length === 0 ? (
            <p className="mt-6 text-gray-500">검색 결과가 없어요.</p>
          ) : (
            <ul className="mt-6 flex flex-col gap-6">
              {searchResults.map((movie) => (
                <li key={movie.id} className="flex gap-4">
                  <img
                    className="h-36 w-24 flex-shrink-0 rounded-lg object-cover"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {movie.originalTitle}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movie.releaseDate}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      {movie.overview}
                    </p>
                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="mt-2 inline-block text-sm font-semibold text-blue-600 no-underline"
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
