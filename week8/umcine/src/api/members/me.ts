import { authApi } from "../auth-api";

export interface MemberInfo {
  memberId: number;
  email: string;
  nickname: string;
  createdAt: string;
}

interface MeResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberInfo;
}

// 인증이 필요하므로 authApi로 요청해요. URL 어디에도 내가 누구인지 적지 않아요.
export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<MeResponse>();
  return response.result;
}
