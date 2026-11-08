import type { TmdbMovieListItem } from "../../api/movies/models";
import type { MovieListItem } from "../../types/movie-list-item";

import { getTmdbPosterUrl } from "./tmdb-image";

export function toMovieListItem(movie: TmdbMovieListItem): MovieListItem {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    posterUrl: getTmdbPosterUrl(movie.poster_path),
    releaseDate: movie.release_date,
  };
}

export function toMovieListItems(movies: TmdbMovieListItem[]): MovieListItem[] {
  return movies.map(toMovieListItem);
}
