import { authApi } from "../auth-api";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

export interface UpdateMeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  // 내 정보 조회와 같은 형태라 이 값으로 캐시를 바로 갱신할 수 있어요.
  result: MemberInfo;
}

export function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<UpdateMeResponse>();
}
