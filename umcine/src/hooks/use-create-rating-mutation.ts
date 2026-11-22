import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";

export function useCreateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings"],
      });
    },
  });
}
