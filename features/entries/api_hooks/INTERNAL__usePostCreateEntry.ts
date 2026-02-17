"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type IngredientPayload = {
  name: string;
  weight_grams?: number | null;
};

export type CreateEntryPayload = {
  person_type: "filip" | "klara";
  title: string;
  description?: string;
  calories: number;
  eaten_at?: string;
  ingredients: IngredientPayload[];
  image?: File | null;
};

const buildFormData = (payload: CreateEntryPayload): FormData => {
  const formData = new FormData();
  formData.append("person_type", payload.person_type);
  formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  formData.append("calories", String(payload.calories));
  if (payload.eaten_at) formData.append("eaten_at", payload.eaten_at);
  if (payload.image) formData.append("image", payload.image);
  formData.append("ingredients", JSON.stringify(payload.ingredients));
  return formData;
};

export const INTERNAL__usePostCreateEntry = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateEntryPayload) => {
      const response = await untypedApiClient.POST("/api/entries/", {
        body: buildFormData(payload),
      });
      if (response.error)
        throw new Error("Failed to create entry", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.entries._def });
      queryClient.invalidateQueries({ queryKey: queries.dashboard._def });
      onSuccess?.();
    },
  });
};
