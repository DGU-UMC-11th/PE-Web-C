"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import type { ReactNode } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "./movie-image";

interface MovieLinkCardProps {
  movieId: number;
  children?: ReactNode;
}

// 회원 서버는 영화 ID만 주므로, 영화 상세와 같은 query key로 TMDB 정보를 붙여요.
export function MovieLinkCard({ movieId, children }: MovieLinkCardProps) {
  const movieQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
  });
  const title = movieQuery.data?.title ?? `영화 ID ${movieId}`;

  return (
    <article className="flex gap-4 rounded-lg border border-gray-200 bg-white p-3">
      <Link
        href={`/movies/${movieId}`}
        className="aspect-[2/3] w-16 flex-shrink-0 overflow-hidden rounded bg-gray-200"
      >
        <MovieImage
          className="block h-full w-full object-cover"
          src={getTmdbPosterUrl(movieQuery.data?.poster_path ?? null)}
          alt={title}
          sizes="64px"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/movies/${movieId}`}
          className="block truncate font-bold text-gray-900 no-underline"
        >
          {movieQuery.isPending ? "불러오는 중이에요." : title}
        </Link>
        {children}
      </div>
    </article>
  );
}
