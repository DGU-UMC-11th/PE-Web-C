import { useQuery } from "@tanstack/react-query";
import { getMyRatings } from "../api/ratings/get-my-ratings";

export function useMyRatingsQuery(enabled = true) {
  return useQuery({
    queryKey: ["ratings", "me"],
    queryFn: getMyRatings,
    enabled,
  });
}
