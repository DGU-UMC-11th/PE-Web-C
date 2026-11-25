// 브라우저에서 읽는 값이라 NEXT_PUBLIC_ 접두사가 필요해요. (Vite의 VITE_ 접두사와 같은 역할)
// Next.js는 빌드할 때 process.env.NEXT_PUBLIC_*를 값으로 바꿔 넣으므로 이름을 그대로 적어야 해요.
const tmdbApiBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const tmdbAccessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요.");
}

if (!apiBaseUrl) {
  throw new Error("회원 서버 주소(NEXT_PUBLIC_API_BASE_URL)가 필요해요.");
}

export const env = {
  tmdbApiBaseUrl,
  tmdbAccessToken,
  apiBaseUrl,
};
