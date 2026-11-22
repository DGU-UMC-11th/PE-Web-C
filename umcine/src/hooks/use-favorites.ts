import {
  mutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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

export const createFavoriteMutationOptions = mutationOptions({
  mutationKey: ["favorites", "create"],
  mutationFn: createFavorite,
});

export const deleteFavoriteMutationOptions = mutationOptions({
  mutationKey: ["favorites", "delete"],
  mutationFn: deleteFavorite,
});

export function useCreateFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...createFavoriteMutationOptions,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}

export function useDeleteFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    ...deleteFavoriteMutationOptions,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["favorites"],
      });
    },
  });
}
