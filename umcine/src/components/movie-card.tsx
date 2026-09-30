import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  const { id, title, releaseDate, posterPath, isBookmarked } = movie;

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img className="movie-card__image" src={posterPath} alt={`${title} 포스터`} />
        <button
          type="button"
          className={
            isBookmarked
              ? "movie-card__bookmark movie-card__bookmark--active"
              : "movie-card__bookmark"
          }
          aria-label={`${title} 북마크`}
          aria-pressed={isBookmarked}
          onClick={() => onToggleBookmark(id)}
        >
          <img
            className="movie-card__bookmark-icon"
            src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>

      <div className="movie-card__title">{title}</div>
      <div className="movie-card__meta">{releaseDate}</div>
    </article>
  );
}
