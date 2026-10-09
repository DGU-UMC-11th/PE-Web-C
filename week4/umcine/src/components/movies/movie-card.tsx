import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { id, title, releaseDate, posterPath } = movie;

  return (
    <article className="flex flex-col gap-2.5">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          <img
            className="aspect-[2/3] w-full rounded-xl bg-surface-hover object-cover"
            src={posterPath}
            alt={`${title} 포스터`}
            width={500}
            height={750}
            loading="lazy"
          />
        </Link>

        <BookmarkButton
          movieId={id}
          movieTitle={title}
          className="absolute top-2.5 right-2.5"
        />
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          <h2
            className="overflow-hidden text-[15px] leading-[1.4] font-semibold whitespace-nowrap text-ellipsis"
            title={title}
          >
            {title}
          </h2>
        </Link>
        <p className="text-[13px] text-muted">{releaseDate}</p>
      </div>
    </article>
  );
}
