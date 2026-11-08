const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

// 주소와 토큰을 여러 파일에 반복하지 않고 이곳에서 한 번만 읽어요.
if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

// 5주차 백엔드(Spring Boot) 주소. .env.local에 없으면 로컬 기본값을 써요.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
