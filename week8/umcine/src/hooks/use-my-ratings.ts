import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "../api/ratings/ratings";
import { useMeQuery } from "./use-me-query";

export const ratingKeys = {
  all: ["ratings"] as const,
  byMember: (memberId: number) => [...ratingKeys.all, "member", memberId] as const,
};

/** 내 평점 목록. memberId는 내 정보 조회에서 얻어요. */
export function useMyRatingsQuery() {
  const meQuery = useMeQuery();
  const memberId = meQuery.data?.memberId;

  return useQuery({
    queryKey: ratingKeys.byMember(memberId ?? 0),
    queryFn: () => getMemberRatings(memberId!),
    enabled: Boolean(memberId),
    retry: false,
  });
}

export function useRatingMutations() {
  const queryClient = useQueryClient();
  const meQuery = useMeQuery();
  const memberId = meQuery.data?.memberId;

  const invalidate = () => {
    if (memberId) {
      queryClient.invalidateQueries({ queryKey: ratingKeys.byMember(memberId) });
    }
  };

  const create = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      invalidate();
      alert("평점을 저장했어요.");
    },
    onError: () => alert("평점 저장에 실패했어요. 다시 시도해 주세요."),
  });

  const update = useMutation({
    mutationFn: ({
      ratingId,
      score,
      comment,
    }: {
      ratingId: number;
      score: number;
      comment?: string;
    }) => updateRating(ratingId, { score, comment }),
    onSuccess: () => {
      invalidate();
      alert("평점을 수정했어요.");
    },
    onError: () => alert("평점 수정에 실패했어요. 다시 시도해 주세요."),
  });

  const remove = useMutation({
    mutationFn: (ratingId: number) => deleteRating(ratingId),
    onSuccess: () => {
      invalidate();
      alert("평점을 삭제했어요.");
    },
    onError: () => alert("평점 삭제에 실패했어요. 다시 시도해 주세요."),
  });

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  };
}
