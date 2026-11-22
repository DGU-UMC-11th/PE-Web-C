import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createFavorite,
  deleteFavorite,
  getFavorites,
} from "../api/favorites/favorites";

export const favoriteQueryKey = ["favorites"] as const;

export function useFavoritesQuery(enabled = true) {
  return useQuery({
    queryKey: favoriteQueryKey,
    queryFn: getFavorites,
    enabled,
  });
}

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKey,
      });
    },
  });
}

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: favoriteQueryKey,
      });
    },
  });
}
