"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type BulkCreateMealPlanPayload = {
  person_type: string;
  dates: string[];
  predefined_meal_id: number;
};

export const INTERNAL__usePostBulkCreateMealPlan = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BulkCreateMealPlanPayload) => {
      const response = await untypedApiClient.POST("/api/meal-plans/bulk-create/", {
        body: payload,
      });
      if (response.error)
        throw new Error("Failed to bulk create meal plans", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.mealPlan._def });
      onSuccess?.();
    },
  });
};
