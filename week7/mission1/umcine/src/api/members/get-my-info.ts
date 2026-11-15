import { memberClient } from "../member-client";
import { getApiResult, type ApiResponse } from "../api-response";

export interface MyInfo { email: string; nickname: string; createdAt: string }
export const MY_INFO_QUERY_KEY = ["members", "me"] as const;

export async function getMyInfo(signal?: AbortSignal) {
  const response = await memberClient.get("members/me", { signal }).json<ApiResponse<MyInfo>>();
  return getApiResult(response);
}
