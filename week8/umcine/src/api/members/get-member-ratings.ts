import { apiClient } from "../api-client";
import type { Rating } from "../../types/member";

type GetMemberRatingsResponse = Rating[];

function getMemberRatings(memberId: number) {
  return apiClient
    .get(`members/${memberId}/ratings`)
    .json<GetMemberRatingsResponse>();
}

export { getMemberRatings, type GetMemberRatingsResponse };
