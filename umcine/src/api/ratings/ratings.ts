import { apiClient } from "../api-client";
import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}

interface Res<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 공개 API (토큰 불필요). 응답이 배열 그대로이거나 공통 형식이어도 처리
export async function getMemberRatings(memberId: number) {
  const data = await apiClient
    .get(`members/${memberId}/ratings`)
    .json<Rating[] | Res<Rating[]>>();
  return Array.isArray(data) ? data : data.result;
}

export function createRating(body: {
  movieId: number;
  score: number;
  comment?: string;
}) {
  return authApi.post("ratings", { json: body }).json<Res<Rating>>();
}

export function updateRating(
  ratingId: number,
  body: { score: number; comment?: string },
) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<Res<Rating>>();
}

export function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<Res<null>>();
}
