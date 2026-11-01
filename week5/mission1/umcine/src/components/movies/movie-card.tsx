import { Link } from "@tanstack/react-router";
import type { MovieCardData } from "../../adapters/movie-adapter";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: MovieCardData;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[9px] bg-[#dddddd] lg:aspect-auto lg:h-[274px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block h-full w-full"
        >
          {movie.posterUrl ? (
            <img
              className="block h-full w-full object-cover"
              src={movie.posterUrl}
              alt={`${movie.title} 포스터`}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
        </Link>

        <BookmarkButton movieId={movie.id} />
      </div>

      <div className="pt-[6px]">
        <h2 className="truncate text-[14px] font-black leading-[17px] text-[#25272c]">
          <Link
            to="/movies/$movieId"
            params={{ movieId: String(movie.id) }}
          >
            {movie.title}
          </Link>
        </h2>

        <p className="mt-px text-[11px] leading-4 text-[#9a9fa8]">
          {movie.releaseDate}
        </p>
      </div>
    </article>
  );
}
