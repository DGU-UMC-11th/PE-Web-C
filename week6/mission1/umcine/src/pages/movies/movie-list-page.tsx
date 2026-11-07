
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";

import { toMovieCardData } from "../../adapters/movie-adapter";

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

  // 실제 TMDB 요청 페이지를 query key에 포함해, 화면 1·2페이지에서
  // API 1페이지(20편)를 공유하도록 해요.
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page: apiPage }],
    queryFn: () => getMovies({ page: apiPage }),
  });

  const movieList = (moviesQuery.data?.results ?? []).map(toMovieCardData);
  const totalPages = Math.max(
    1,
    Math.ceil(
      Math.min(moviesQuery.data?.total_results ?? 0, 10000) / PAGE_SIZE
    )
  );

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

      {moviesQuery.isPending ? (
        <p role="status">
          영화 목록을 불러오는 중이에요.
        </p>
      ) : moviesQuery.isError ? (
        <div role="alert" className="py-20 text-center">
          <p className="mb-4 text-lg font-bold">
            영화 목록을 불러오지 못했어요.
          </p>

          <button
            type="button"
            onClick={() => void moviesQuery.refetch()}
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
