import ky from "ky";
import { env } from "../config/env";

// 우리 백엔드(Spring Boot, http://localhost:8080) 전용 ky 인스턴스
// TMDB와 달리 인증 header가 아직 없어요. (로그인은 7주차)
export const umcClient = ky.create({
  baseUrl: `${env.apiBaseUrl}/`,
  // 중복 확인처럼 사용자가 버튼을 눌러 보내는 요청은 실패하면 바로 알려 주는 편이 좋아서 재시도하지 않아요.
  retry: 0,
});
