const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

// poster_path가 없으면 null을 돌려줘요. 화면은 null일 때 <img> 대신 "이미지 없음" 영역을 그려요.
export function getTmdbPosterUrl(posterPath: string | null) {
  return posterPath ? `${TMDB_POSTER_BASE_URL}${posterPath}` : null;
}

export function getTmdbBackdropUrl(backdropPath: string | null) {
  return backdropPath ? `${TMDB_BACKDROP_BASE_URL}${backdropPath}` : null;
}
