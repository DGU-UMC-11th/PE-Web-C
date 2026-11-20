import { apiClient } from "../api-client";
import { authApi } from "../auth-api";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiEnvelope<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface SaveRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

/**
 * GET /members/{memberId}/ratings — 공개 API라 토큰 없이도 볼 수 있어요.
 * 공통 응답 형식으로 감싸지 않고 배열을 그대로 돌려주는 엔드포인트예요.
 */
export function getMemberRatings(memberId: number): Promise<Rating[]> {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

/** POST /ratings — memberId는 토큰에서 꺼내므로 요청에 넣지 않아요. */
export async function createRating(body: SaveRatingRequest): Promise<Rating> {
  const response = await authApi
    .post("ratings", { json: body })
    .json<ApiEnvelope<Rating>>();
  return response.result;
}

/** PATCH /ratings/{ratingId} */
export async function updateRating(
  ratingId: number,
  body: { score: number; comment?: string },
): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiEnvelope<Rating>>();
  return response.result;
}

/** DELETE /ratings/{ratingId} */
export async function deleteRating(ratingId: number): Promise<void> {
  await authApi.delete(`ratings/${ratingId}`).json<ApiEnvelope<null>>();
}
