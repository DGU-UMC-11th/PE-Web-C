import { checkMutationResponse } from "../api-response";
import { apiClient } from "../api-client";
import { memberClient } from "../member-client";

export interface RatingInput {
  score: number;
  comment: string;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}

export const memberRatingsKey = (memberId: number | undefined) => ["members", memberId, "ratings"] as const;

export async function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(movieId: number, input: RatingInput) {
  await checkMutationResponse(await memberClient.post("ratings", { json: { movieId, ...input } }));
}

export async function updateRating(ratingId: number, input: RatingInput) {
  await checkMutationResponse(await memberClient.patch(`ratings/${ratingId}`, { json: input }));
}

export async function deleteRating(ratingId: number) {
  await checkMutationResponse(await memberClient.delete(`ratings/${ratingId}`));
}
