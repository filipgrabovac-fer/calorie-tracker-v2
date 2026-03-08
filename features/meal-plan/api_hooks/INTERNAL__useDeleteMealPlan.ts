"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__useDeleteMealPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await untypedApiClient.DELETE(`/api/meal-plans/${id}/` as any);
      if (response.error)
        throw new Error("Failed to delete meal plan", { cause: response.error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.mealPlan._def });
    },
  });
};
