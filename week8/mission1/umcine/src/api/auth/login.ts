import { apiClient } from "../api-client";
import { getApiResult, type ApiResponse } from "../api-response";

export interface LoginRequest { email: string; password: string }
export interface LoginResult { nickname: string; accessToken: string }

export async function login(body: LoginRequest, signal?: AbortSignal) {
  const response = await apiClient.post("auth/login", { json: body, signal }).json<ApiResponse<LoginResult>>();
  const result = getApiResult(response);
  if (!result.accessToken) throw new Error("로그인 토큰이 없어요.");
  return result;
}
