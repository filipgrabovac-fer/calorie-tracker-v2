"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type PatchMealPayload = {
  name?: string;
  calories?: number;
  category?: number;
  ingredients?: Array<{ name: string; weight_grams?: number | null }>;
};

export const INTERNAL__usePatchMeal = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: PatchMealPayload }) => {
      const response = await untypedApiClient.PATCH(`/api/predefined-meals/${id}/`, {
        body: payload,
      });
      if (response.error)
        throw new Error("Failed to update meal", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.meals.categories.queryKey });
      onSuccess?.();
    },
  });
};
