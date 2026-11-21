import ky from "ky";
import { env } from "../config/env";

// 영화 서버와 회원 서버는 주소와 인증 헤더를 별도로 관리해요.
export const apiClient = ky.create({
  baseUrl: `${env.apiBaseUrl.replace(/\/+$/, "")}/`,
  retry: 0,
  timeout: 10000,
});
