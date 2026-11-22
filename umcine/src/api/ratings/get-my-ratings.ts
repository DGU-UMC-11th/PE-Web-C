import { authApi } from "../auth-api";
import type { Rating } from "./create-rating";

interface MyRatingsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    content: Rating[];
    totalElements: number;
    totalPages: number;
  };
}

export function getMyRatings() {
  return authApi
    .get("ratings/me", {
      searchParams: {
        page: 0,
        size: 100,
      },
    })
    .json<MyRatingsResponse>();
}
