import { authApi } from "../auth-api";
import type { ApiResponse } from "../types";

interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

async function getMe(): Promise<MemberInfo> {
  const response = await authApi
    .get("members/me")
    .json<ApiResponse<MemberInfo>>();
  return response.result;
}

export { getMe, type MemberInfo };
