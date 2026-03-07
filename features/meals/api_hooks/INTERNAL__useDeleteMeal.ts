"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__useDeleteMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await untypedApiClient.DELETE(`/api/predefined-meals/${id}/`);
      if (response.error)
        throw new Error("Failed to delete meal", { cause: response.error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.meals.categories.queryKey });
    },
  });
};
