const POSTER_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

export function getTmdbPosterUrl(path: string | null) {
  return path ? `${POSTER_BASE}${path}` : null;
}

export function getTmdbBackdropUrl(path: string | null) {
  return path ? `${BACKDROP_BASE}${path}` : null;
}