import { umcClient } from "../umc-client";

// POST /members (6주차 백엔드)
export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

// 6주차부터 쓰기 API는 { isSuccess, code, message, result } 공통 형식으로 응답해요.
export interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface SignupResult {
  memberId: number;
  email: string;
  nickname: string;
}

export type SignupResponse = ApiEnvelope<SignupResult>;

export function signup(body: SignupRequest) {
  // passwordConfirm은 화면에서만 검사하므로 요청에 포함하지 않아요.
  return umcClient.post("members", { json: body }).json<SignupResponse>();
}
