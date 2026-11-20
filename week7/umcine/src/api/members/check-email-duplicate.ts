import { apiClient } from "../api-client";

export interface CheckEmailDuplicateResponse {
  available: boolean; // true면 아직 쓸 수 있는 이메일이에요
}

export function checkEmailDuplicate(email: string) {
  return apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailDuplicateResponse>();
}
