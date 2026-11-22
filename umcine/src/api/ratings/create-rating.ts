import { authApi } from "../auth-api";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", {
      json: body,
    })
    .json<CreateRatingResponse>();
}
