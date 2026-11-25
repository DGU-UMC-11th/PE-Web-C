import type { Rating } from "../../types/member";
import { authApi } from "../auth-api";
import type { ApiResponse } from "../types";

interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment?: string;
}

function createRating(body: CreateRatingRequest) {
  return authApi.post("ratings", { json: body }).json<ApiResponse<Rating>>();
}

function updateRating({ ratingId, ...body }: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<ApiResponse<Rating>>();
}

function deleteRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}

export {
  createRating,
  deleteRating,
  updateRating,
  type CreateRatingRequest,
  type UpdateRatingRequest,
};
