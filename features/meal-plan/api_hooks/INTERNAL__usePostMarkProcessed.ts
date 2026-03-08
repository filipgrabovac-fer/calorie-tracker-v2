"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__usePostMarkProcessed = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const response = await untypedApiClient.POST("/api/meal-plans/mark-processed/", {
        body: { ids },
      });
      if (response.error)
        throw new Error("Failed to mark meal plans as processed", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.mealPlan._def });
      queryClient.invalidateQueries({ queryKey: queries.entries._def });
      queryClient.invalidateQueries({ queryKey: queries.dashboard._def });
      onSuccess?.();
    },
  });
};
