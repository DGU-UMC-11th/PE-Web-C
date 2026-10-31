import ky from "ky";
import { env } from "../config/env";

// base URL과 Authorization header를 한 번만 설정해 두고 모든 TMDB 요청이 공유해요.
// ky는 .json<T>()를 호출할 때 Accept header를 알아서 붙이고,
// 성공 범위가 아닌 HTTP status에서는 HTTPError를 던져요.
export const tmdbClient = ky.create({
  prefixUrl: `${env.tmdbApiBaseUrl}/`,
  headers: {
    Authorization: `Bearer ${env.tmdbAccessToken}`,
  },
});
