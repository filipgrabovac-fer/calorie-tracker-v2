"use client";

import { useMutation } from "@tanstack/react-query";
import { untypedApiClient } from "@/app/schema/apiClient";

export type EstimateCaloriesPayload = {
  title?: string;
  ingredients: Array<{ name: string; weight_grams?: number | null }>;
};

export type EstimateCaloriesResponse = {
  estimated_calories: number;
};

export const INTERNAL__usePostEstimateCalories = (onSuccess?: (data: EstimateCaloriesResponse) => void) => {
  return useMutation({
    mutationFn: async (payload: EstimateCaloriesPayload) => {
      const response = await untypedApiClient.POST("/api/estimate-calories/", {
        body: payload,
      });
      if (response.error)
        throw new Error("Failed to estimate calories", { cause: response.error });
      return response.data as EstimateCaloriesResponse;
    },
    onSuccess,
  });
};
