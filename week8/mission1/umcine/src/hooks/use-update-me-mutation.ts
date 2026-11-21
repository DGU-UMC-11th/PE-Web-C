import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MY_INFO_QUERY_KEY, type MyInfo } from "../api/members/get-my-info";
import { updateMyInfo } from "../api/members/update-my-info";
import { useAuthStore } from "../stores/auth-store";

export function useUpdateMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ nickname, accessToken }: { nickname: string; accessToken: string }) => {
      if (useAuthStore.getState().accessToken !== accessToken) {
        throw new Error("로그인 상태가 바뀌었어요.");
      }
      return updateMyInfo(nickname);
    },
    onSuccess: async (updated, { accessToken }) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      await queryClient.cancelQueries({ queryKey: MY_INFO_QUERY_KEY, exact: true });
      if (useAuthStore.getState().accessToken !== accessToken) return;
      queryClient.setQueryData<MyInfo>(MY_INFO_QUERY_KEY, updated);
    },
  });
}
