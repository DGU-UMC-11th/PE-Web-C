import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavorite,
  getFavorites,
  getFavoriteStatus,
  removeFavorite,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

const FAVORITES_KEY = ["favorites"] as const;

// 목록: 마이페이지와 영화 카드의 아이콘이 함께 사용해요.
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: [...FAVORITES_KEY, "list"],
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// 단건 여부: 영화 상세에서 버튼 상태를 정할 때 사용해요.
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: [...FAVORITES_KEY, "status", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

// 등록과 해제는 목록과 여부를 모두 바꾸므로 ["favorites"] 전체를 다시 조회해요.
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      movieId,
      isFavorite,
    }: {
      movieId: number;
      isFavorite: boolean;
    }) => {
      if (isFavorite) {
        await removeFavorite(movieId);
      } else {
        await addFavorite(movieId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_KEY });
    },
    onError: () => {
      alert("즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요.");
    },
  });
}
