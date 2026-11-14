import ky from "ky";
import { env } from "../config/env";

// TMDB가 아니라 우리 서버(http://localhost:8080)로 보내는 요청에 써요.
// 설치된 ky는 1.x라서 baseUrl이 아니라 prefixUrl이에요.
// prefixUrl을 쓰면 각 요청 경로는 "/"로 시작하면 안 돼요. (members/... 처럼)
export const apiClient = ky.create({
  prefixUrl: env.apiBaseUrl ? `${env.apiBaseUrl}/` : "/",
});
