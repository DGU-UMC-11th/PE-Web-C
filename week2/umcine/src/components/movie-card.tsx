import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster-wrapper">
        <img
          className="movie-poster"
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
        />

    <button
      type="button"
      aria-label={`${movie.title} 북마크`}
      aria-pressed={movie.isBookmarked}
      className={`bookmark-button ${
        movie.isBookmarked ? "bookmarked" : ""
      }`}
      onClick={() => onToggleBookmark(movie.id)}
    >
      <img
        src={
          movie.isBookmarked
            ? "/icons/bookmark.svg"
            : "/icons/bookmark-outline.svg"
        }
        alt=""
      />
    </button>
      </div>

      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p>{movie.releaseDate}</p>
      </div>
    </article>
  );
}