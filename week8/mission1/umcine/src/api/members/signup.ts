import { apiClient } from "../api-client";
import { getApiResult, type ApiResponse } from "../api-response";

export interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

type SignupResponse = ApiResponse<{ memberId: number; email: string; nickname: string }>;

export async function signup(body: SignupRequest) {
  const response = await apiClient.post("members", { json: body }).json<SignupResponse>();
  getApiResult(response);
  return response;
}
