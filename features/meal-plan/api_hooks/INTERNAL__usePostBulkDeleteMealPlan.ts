"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__usePostBulkDeleteMealPlan = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await untypedApiClient.POST("/api/meal-plans/bulk-delete/", {
        body: { ids },
      });
      if (response.error)
        throw new Error("Failed to bulk delete meal plans", { cause: response.error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.mealPlan._def });
      onSuccess?.();
    },
  });
};
