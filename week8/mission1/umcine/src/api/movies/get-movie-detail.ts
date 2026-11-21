import { queryOptions } from "@tanstack/react-query";
import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieDetail } from "./models";

export function movieDetailOptions(movieId: number) {
  return queryOptions({
    queryKey: ["movies", "detail", movieId],
    queryFn: ({ signal }) => tmdbClient.get(`movie/${movieId}`, {
      searchParams: { language: "ko-KR" },
      signal,
    }).json<TmdbMovieDetail>(),
    staleTime: 30 * 1000,
  });
}
