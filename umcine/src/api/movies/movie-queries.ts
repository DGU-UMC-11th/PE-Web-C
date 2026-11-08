import { queryOptions } from "@tanstack/react-query";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

// query key와 query function을 한곳에 모아 두면, 화면마다 key 모양이 어긋나는 일을 막을 수 있어요.
// key 앞부분을 "movies"로 맞춰 두면 나중에 ["movies"]로 영화 관련 캐시를 한 번에 무효화할 수도 있어요.
// (선택 미션: queryOptions로 리팩터링)

export const movieListQuery = (page: number) =>
  queryOptions({
    // page가 다르면 다른 캐시예요. 1 → 2 → 1페이지로 돌아오면 1페이지 캐시를 다시 써요.
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

export const movieSearchQuery = (query: string) =>
  queryOptions({
    // 검색어가 key에 들어가야 검색어마다 결과가 따로 저장돼요.
    queryKey: ["movies", "search", { query }],
    queryFn: () => searchMovies({ query }),
    // 빈 검색어로는 요청하지 않아요.
    enabled: query.length > 0,
  });

export const movieDetailQuery = (movieId: number) =>
  queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    // 영화 번호가 양의 정수일 때만 요청해요.
    enabled: Number.isInteger(movieId) && movieId > 0,
    // 상세는 잘 바뀌지 않지만, 미니 실습대로 전역 기본값(1분) 대신 30초로 따로 지정해 봤어요.
    staleTime: 30 * 1000,
  });
