import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster">
        <img
          className="poster-image"
          src={movie.posterPath}
          alt={movie.title}
        />

        <button
          className="bookmark-button"
          type="button"
          aria-label={`${movie.title} 북마크`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="bookmark-icon"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <h2 className="movie-title">{movie.title}</h2>

      <p className="movie-date">{movie.releaseDate}</p>
    </article>
  );
}

export default MovieCard;
