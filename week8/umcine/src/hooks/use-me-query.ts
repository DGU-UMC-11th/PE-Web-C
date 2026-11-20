import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

// 내 정보는 자주 바뀌지 않아서 5분 동안 최신으로 취급해요.
const FIVE_MINUTES = 5 * 60 * 1000;

export const meQueryKey = ["members", "me"] as const;

export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: FIVE_MINUTES,
    // 401로 토큰을 지운 뒤 같은 조회를 자동으로 다시 시도하지 않도록 꺼요.
    retry: false,
  });
}
