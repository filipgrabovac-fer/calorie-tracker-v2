"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type CreateMealPlanPayload = {
  person_type: string;
  date: string;
  predefined_meal: number;
};

export const INTERNAL__usePostCreateMealPlan = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMealPlanPayload) => {
      const response = await untypedApiClient.POST("/api/meal-plans/", { body: payload });
      if (response.error)
        throw new Error("Failed to create meal plan", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.mealPlan._def });
      onSuccess?.();
    },
  });
};
