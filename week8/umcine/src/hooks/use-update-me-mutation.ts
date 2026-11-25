import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";
import { ME_QUERY_KEY } from "./use-me-query";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      // 응답에 수정된 내 정보가 그대로 오므로 다시 조회하지 않고 캐시를 바꿔요.
      queryClient.setQueryData<MemberInfo>(ME_QUERY_KEY, response.result);
      alert("내 정보 수정에 성공했어요.");
      navigate({ to: "/me" });
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
