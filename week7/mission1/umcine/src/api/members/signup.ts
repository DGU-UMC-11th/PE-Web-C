import { apiClient } from "../api-client";

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

export interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { memberId: number; email: string; nickname: string };
}

export function signup(body: SignupRequest) {
  // 비밀번호 확인은 화면에서만 검사하고 서버에는 보내지 않아요.
  return apiClient.post("members", { json: body }).json<SignupResponse>();
}
