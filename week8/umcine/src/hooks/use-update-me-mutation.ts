import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberInfo } from "../api/members/me";
import { updateMe } from "../api/members/update-me";
import { meQueryKey } from "./use-me-query";

/**
 * 로그인은 invalidateQueries로 "다시 조회"하지만,
 * 여기는 응답의 result가 내 정보 조회와 같은 형태라 setQueryData로 캐시를 직접 바꿔요.
 * 이미 최신 값을 받았으니 GET /members/me 를 한 번 더 부를 이유가 없어요.
 */
export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMe,
    onSuccess: (response) => {
      queryClient.setQueryData<MemberInfo>(meQueryKey, response.result);
      alert("내 정보 수정에 성공했어요.");
    },
    onError: () => {
      alert("내 정보 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
