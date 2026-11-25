import Link from "next/link";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { FavoriteButton } from "./favorite-button";
import { MovieImage } from "./movie-image";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-gray-200">
        <Link href={`/movies/${movie.id}`}>
          <MovieImage
            className="block h-full w-full object-cover"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={movie.title}
            sizes="(min-width: 1200px) 200px, 45vw"
          />
        </Link>
        <FavoriteButton movieId={movie.id} className="absolute top-2 right-2" />
      </div>
      <Link href={`/movies/${movie.id}`} className="no-underline">
        <h3 className="truncate text-[15px] font-bold text-gray-900">
          {movie.title}
        </h3>
      </Link>
      <p className="text-[13px] text-gray-500">{movie.release_date}</p>
    </article>
  );
}

export default MovieCard;
