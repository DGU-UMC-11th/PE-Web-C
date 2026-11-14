import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

// 선택 미션: queryOptions로 query key와 query function을 한곳에 묶어요.
// 화면에서는 useQuery(movieQueries.list(page)) 처럼 쓰기만 하면 되고,
// key를 바꿀 일이 생겨도 이 파일만 고치면 돼요.

const THIRTY_SECONDS = 30 * 1000;

const movieKeys = {
  all: ["movies"] as const,
  list: (page: number) => [...movieKeys.all, "list", { page }] as const,
  search: (query: string) => [...movieKeys.all, "search", { query }] as const,
  detail: (movieId: number) => [...movieKeys.all, "detail", movieId] as const,
};

export const movieQueries = {
  keys: movieKeys,

  // 페이지마다 캐시를 따로 두려고 key에 page를 넣어요.
  list: (page: number) =>
    queryOptions({
      queryKey: movieKeys.list(page),
      queryFn: () => getMovies({ page }),
    }),

  // 검색어가 바뀌면 key도 바뀌므로 검색어별로 캐시가 생겨요.
  // 검색어가 없을 때는 요청하지 않아요.
  search: (query: string) =>
    queryOptions({
      queryKey: movieKeys.search(query),
      queryFn: () => searchMovies({ query }),
      enabled: query.length > 0,
    }),

  // 상세는 전역 기본값(1분) 대신 30초만 최신으로 취급해요.
  detail: (movieId: number) =>
    queryOptions({
      queryKey: movieKeys.detail(movieId),
      queryFn: () => getMovieDetail(movieId),
      enabled: Number.isInteger(movieId) && movieId > 0,
      staleTime: THIRTY_SECONDS,
    }),
};
