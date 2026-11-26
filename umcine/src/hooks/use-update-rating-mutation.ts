import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRating } from "../api/ratings/update-rating";

export function useUpdateRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ratings", "me"],
      });
    },
  });
}
