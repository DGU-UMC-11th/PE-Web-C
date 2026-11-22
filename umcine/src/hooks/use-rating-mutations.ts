import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  updateRating,
} from "../api/ratings/ratings";

function useInvalidateRatings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["ratings"] });
}

export function useCreateRatingMutation() {
  const invalidate = useInvalidateRatings();
  return useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      invalidate();
      alert("평점을 등록했어요.");
    },
    onError: () => alert("평점 등록에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useUpdateRatingMutation() {
  const invalidate = useInvalidateRatings();
  return useMutation({
    mutationFn: (v: { ratingId: number; score: number; comment?: string }) =>
      updateRating(v.ratingId, { score: v.score, comment: v.comment }),
    onSuccess: () => {
      invalidate();
      alert("평점을 수정했어요.");
    },
    onError: () => alert("평점 수정에 실패했어요. 다시 시도해 주세요."),
  });
}

export function useDeleteRatingMutation() {
  const invalidate = useInvalidateRatings();
  return useMutation({
    mutationFn: deleteRating,
    onSuccess: () => {
      invalidate();
      alert("평점을 삭제했어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요. 다시 시도해 주세요."),
  });
}
