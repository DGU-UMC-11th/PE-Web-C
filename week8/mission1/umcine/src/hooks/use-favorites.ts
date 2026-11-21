import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  FAVORITES_QUERY_KEY,
  favoriteStatusKey,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

export function useFavorites() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useFavoriteStatus(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: favoriteStatusKey(movieId),
    queryFn: ({ signal }) => getFavoriteStatus(movieId, signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ isFavorite, accessToken }: { isFavorite: boolean; accessToken: string }) => {
      if (useAuthStore.getState().accessToken !== accessToken) {
        throw new Error("로그인 상태가 바뀌었어요.");
      }
      return isFavorite ? removeFavorite(movieId) : addFavorite(movieId);
    },
    onSuccess: async (_result, { accessToken }) => {
      if (useAuthStore.getState().accessToken !== accessToken) return;
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY, exact: true }),
        queryClient.invalidateQueries({ queryKey: favoriteStatusKey(movieId), exact: true }),
      ]);
    },
  });
}
