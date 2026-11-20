import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
  getFavoriteStatus,
} from "../api/favorites/favorites";
import { useAuthStore } from "../stores/auth-store";

export const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
  status: (movieId: number) => [...favoriteKeys.all, "status", movieId] as const,
};

/** 마이페이지와 목록 카드가 함께 쓰는 "내 즐겨찾기 전체" 조회 */
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: getFavorites,
    enabled: Boolean(accessToken),
    retry: false,
  });
}

/** 상세 화면에서 이 영화 하나만 확인할 때 쓰는 조회 */
export function useFavoriteStatusQuery(movieId: number, enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken) && enabled && Number.isInteger(movieId) && movieId > 0,
    retry: false,
  });
}

/**
 * 등록·해제 후에는 목록과 단건 여부가 모두 달라지므로
 * ["favorites"] 아래를 통째로 무효화해요. (부분 일치로 하위 key까지 함께 무효화돼요)
 */
export function useToggleFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
  };

  const add = useMutation({
    mutationFn: () => createFavorite(movieId),
    onSuccess: invalidate,
    onError: () => alert("즐겨찾기에 실패했어요. 다시 시도해 주세요."),
  });

  const remove = useMutation({
    mutationFn: () => deleteFavorite(movieId),
    onSuccess: invalidate,
    onError: () => alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요."),
  });

  return {
    add,
    remove,
    isPending: add.isPending || remove.isPending,
    toggle: (isFavorite: boolean) => (isFavorite ? remove.mutate() : add.mutate()),
  };
}
