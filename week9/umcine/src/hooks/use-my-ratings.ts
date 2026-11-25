import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMemberRatings } from "../api/members/get-member-ratings";
import {
  createRating,
  deleteRating,
  updateRating,
} from "../api/ratings/ratings";
import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id";

export function useMyMemberId() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return getMemberIdFromToken(accessToken);
}

function myRatingsKey(memberId: number | null) {
  return ["members", memberId, "ratings"] as const;
}

// GET /members/{memberId}/ratings에 토큰의 회원 ID를 넣어 내 평점을 조회해요.
export function useMyRatingsQuery() {
  const memberId = useMyMemberId();

  return useQuery({
    queryKey: myRatingsKey(memberId),
    queryFn: () => getMemberRatings(memberId as number),
    enabled: memberId !== null,
  });
}

export function useRatingMutations() {
  const queryClient = useQueryClient();
  const memberId = useMyMemberId();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: myRatingsKey(memberId) });

  const createMutation = useMutation({
    mutationFn: createRating,
    onSuccess: invalidate,
    onError: () => alert("평점을 등록하지 못했어요. 다시 시도해 주세요."),
  });

  const updateMutation = useMutation({
    mutationFn: updateRating,
    onSuccess: invalidate,
    onError: () => alert("평점을 수정하지 못했어요. 다시 시도해 주세요."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRating,
    onSuccess: invalidate,
    onError: () => alert("평점을 삭제하지 못했어요. 다시 시도해 주세요."),
  });

  return { createMutation, updateMutation, deleteMutation };
}
