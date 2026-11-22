import { authApi } from "../auth-api";
import type { Rating } from "./create-rating";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment: string;
}

interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}

export function updateRating({
  ratingId,
  score,
  comment,
}: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, {
      json: {
        score,
        comment,
      },
    })
    .json<UpdateRatingResponse>();
}
