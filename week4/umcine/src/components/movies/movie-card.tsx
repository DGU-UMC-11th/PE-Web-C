import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[9px] bg-[#dddddd] lg:aspect-auto lg:h-[274px]">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="block h-full w-full">
          <img className="block h-full w-full object-cover" src={movie.posterPath} alt={movie.title + " 포스터"} />
        </Link>
        <BookmarkButton movieId={movie.id} />
      </div>
      <div className="pt-[6px]">
        <h2 className="truncate text-[14px] font-black leading-[17px] text-[#25272c]">
          <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>{movie.title}</Link>
        </h2>
        <p className="mt-px text-[11px] leading-4 text-[#9a9fa8]">{movie.releaseDate}</p>
      </div>
    </article>
  );
}
