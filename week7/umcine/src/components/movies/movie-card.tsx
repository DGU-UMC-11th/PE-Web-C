import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { formatReleaseDate } from "../../utils/movies/format-movie";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";
import { MoviePoster } from "./movie-poster";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { id, title, release_date, poster_path } = movie;
  const posterUrl = getTmdbPosterUrl(poster_path);

  return (
    <article className="flex flex-col gap-2.5">
      <div className="relative">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          <MoviePoster
            src={posterUrl}
            alt={`${title} 포스터`}
            className="aspect-[2/3] w-full rounded-xl bg-surface-hover"
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
        <p className="text-[13px] text-muted">
          {formatReleaseDate(release_date)}
        </p>
      </div>
    </article>
  );
}
