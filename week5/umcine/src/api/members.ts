import type { CheckResponse, Rating } from "../types/member";

const API_BASE_URL = "http://localhost:3000";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export function checkNickname(nickname: string) {
  return request<CheckResponse>(
    `/members/nickname/${encodeURIComponent(nickname)}`
  );
}

export function checkEmail(email: string) {
  return request<CheckResponse>(`/members/email/${encodeURIComponent(email)}`);
}

export function getMemberRatings(memberId: number) {
  return request<Rating[]>(`/members/${memberId}/ratings`);
}
