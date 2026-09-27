import type { Movie } from "../types/movie";

type MovieCardProps = {
  movie: Movie;
  onToggleBookmark: (id: number) => void;
};

function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <div className="movie-card">
      <img src={movie.posterPath} alt={movie.title} />
      <button
        className="bookmark-btn"
        onClick={() => onToggleBookmark(movie.id)}
      >
        <img
          src={
            movie.isBookmarked
              ? "/icons/bookmark.svg"
              : "/icons/bookmark-outline.svg"
          }
          alt="북마크"
        />
      </button>
      <h3>{movie.title}</h3>
      <p>{movie.releaseDate}</p>
    </div>
  );
}

export default MovieCard;