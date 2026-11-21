import { memberClient } from "../member-client";
import { getApiResult, type ApiResponse } from "../api-response";
import type { MyInfo } from "./get-my-info";

export async function updateMyInfo(nickname: string) {
  const response = await memberClient.patch("members/me", { json: { nickname } }).json<ApiResponse<MyInfo>>();
  return getApiResult(response);
}
