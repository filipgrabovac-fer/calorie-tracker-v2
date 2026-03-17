"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type CreateMealPayload = {
  name: string;
  calories: number;
  category: number;
  ingredients: Array<{ name: string; weight_grams?: number | null }>;
  image?: File | null;
};

const buildFormData = (payload: CreateMealPayload): FormData => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("calories", String(payload.calories));
  formData.append("category", String(payload.category));
  if (payload.image) formData.append("image", payload.image);
  formData.append("ingredients", JSON.stringify(payload.ingredients));
  return formData;
};

export const INTERNAL__usePostCreateMeal = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMealPayload) => {
      const response = await untypedApiClient.POST("/api/predefined-meals/", {
        body: buildFormData(payload),
      });
      if (response.error)
        throw new Error("Failed to create meal", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.meals.categories.queryKey });
      onSuccess?.();
    },
  });
};
