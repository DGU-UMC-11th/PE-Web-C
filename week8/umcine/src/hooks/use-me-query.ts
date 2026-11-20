import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/members/me";
import { useAuthStore } from "../stores/auth-store";

export const ME_QUERY_KEY = ["members", "me"] as const;
const FIVE_MINUTES = 5 * 60 * 1000;

// 헤더와 마이페이지가 같은 query key로 내 정보 캐시를 함께 써요.
export function useMeQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: getMe,
    enabled: Boolean(accessToken),
    staleTime: FIVE_MINUTES,
    // 401로 토큰을 지운 뒤 같은 조회를 다시 시도하지 않아요.
    retry: false,
  });
}
