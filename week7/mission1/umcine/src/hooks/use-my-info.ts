import { useQuery } from "@tanstack/react-query";
import { getMyInfo, MY_INFO_QUERY_KEY } from "../api/members/get-my-info";
import { useAuthStore } from "../stores/auth-store";

export function useMyInfo() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const query = useQuery({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: ({ signal }) => getMyInfo(signal),
    enabled: Boolean(accessToken),
    retry: false,
    staleTime: 0,
  });
  return { ...query, isLoggedIn: Boolean(accessToken) };
}
