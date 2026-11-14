import type { TmdbMovieListItem } from "../api/movies/models";
import { getTmdbPosterUrl } from "../utils/tmdb-image";

export interface MovieCardData {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterUrl: string | null;
  overview: string;
}

export function toMovieCardData(
  movie: TmdbMovieListItem
): MovieCardData {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    releaseDate: movie.release_date,
    posterUrl: getTmdbPosterUrl(movie.poster_path),
    overview: movie.overview,
  };
}
