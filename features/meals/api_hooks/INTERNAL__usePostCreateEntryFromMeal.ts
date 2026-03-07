"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type CreateEntryFromMealPayload = {
  person_type: "filip" | "klara";
  predefined_meal: number;
  eaten_at?: string;
};

export const INTERNAL__usePostCreateEntryFromMeal = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateEntryFromMealPayload) => {
      const response = await untypedApiClient.POST("/api/entries/", {
        body: payload,
      });
      if (response.error)
        throw new Error("Failed to create entry from meal", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.entries._def });
      queryClient.invalidateQueries({ queryKey: queries.dashboard._def });
      onSuccess?.();
    },
  });
};
