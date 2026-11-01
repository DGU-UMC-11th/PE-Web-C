import ky from "ky";
import { env } from "../config/env";

// base URL과 인증 header를 한 번만 설정한 TMDB 전용 ky 인스턴스
// baseUrl 끝에 /를 붙이고, 요청 path는 "movie/popular"처럼 / 없이 써요.
export const tmdbClient = ky.create({
  baseUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
