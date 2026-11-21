import { skipToken, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  memberRatingsKey,
  updateRating,
  type RatingInput,
} from "../api/ratings/ratings";
import { useAuthStore } from "../stores/auth-store";

type RatingChange =
  | { action: "create"; input: RatingInput }
  | { action: "update"; ratingId: number; input: RatingInput }
  | { action: "delete"; ratingId: number };

export function useMemberRatings(memberId: number | undefined) {
  return useQuery({
    queryKey: memberRatingsKey(memberId),
    queryFn: memberId === undefined ? skipToken : ({ signal }) => getMemberRatings(memberId, signal),
    retry: false,
  });
}

export function useRatingMutation(movieId: number, memberId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ change, accessToken }: { change: RatingChange; accessToken: string }) => {
      if (useAuthStore.getState().accessToken !== accessToken) {
        throw new Error("로그인 상태가 바뀌었어요.");
      }
      switch (change.action) {
        case "create":
          return createRating(movieId, change.input);
        case "update":
          return updateRating(change.ratingId, change.input);
        case "delete":
          return deleteRating(change.ratingId);
      }
    },
    onSuccess: (_result, { accessToken }) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      return queryClient.invalidateQueries({ queryKey: memberRatingsKey(memberId), exact: true });
    },
  });
}
