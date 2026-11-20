const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

// poster_path / backdrop_path는 "/abc.jpg" 같은 조각이라 앞에 base URL을 붙여야 해요.
// 값이 없으면 null을 반환하고, 화면에서는 null일 때 <img>를 렌더링하지 않아요.
export function getTmdbPosterUrl(posterPath: string | null) {
  return posterPath ? `${TMDB_POSTER_BASE_URL}${posterPath}` : null;
}

export function getTmdbBackdropUrl(backdropPath: string | null) {
  return backdropPath ? `${TMDB_BACKDROP_BASE_URL}${backdropPath}` : null;
}
