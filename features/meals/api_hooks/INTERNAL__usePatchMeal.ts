"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type PatchMealPayload = {
  name?: string;
  calories?: number;
  category?: number;
  ingredients?: Array<{ name: string; weight_grams?: number | null }>;
  image?: File | null;
};

const buildFormData = (payload: PatchMealPayload): FormData => {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("name", payload.name);
  if (payload.calories !== undefined) formData.append("calories", String(payload.calories));
  if (payload.category !== undefined) formData.append("category", String(payload.category));
  if (payload.image) formData.append("image", payload.image);
  if (payload.ingredients !== undefined)
    formData.append("ingredients", JSON.stringify(payload.ingredients));
  return formData;
};

export const INTERNAL__usePatchMeal = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: PatchMealPayload }) => {
      const response = await untypedApiClient.PATCH(`/api/predefined-meals/${id}/`, {
        body: buildFormData(payload),
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
