import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="movie-card">
      <div className="movie-card__thumb">
        <img
          className="movie-card__poster"
          src={posterPath}
          alt={`${title} 포스터`}
          width={500}
          height={750}
          loading="lazy"
        />

        <button
          type="button"
          className={
            isBookmarked
              ? "movie-card__bookmark movie-card__bookmark--active"
              : "movie-card__bookmark"
          }
          aria-pressed={isBookmarked}
          aria-label={
            isBookmarked ? `${title} 북마크 해제` : `${title} 북마크 추가`
          }
          onClick={() => onToggleBookmark(id)}
        >
          <span className="icon movie-card__bookmark-icon" aria-hidden="true" />
        </button>
      </div>

      <div className="movie-card__info">
        <h2 className="movie-card__title" title={title}>
          {title}
        </h2>
        <p className="movie-card__date">{releaseDate}</p>
      </div>
    </article>
  );
}
