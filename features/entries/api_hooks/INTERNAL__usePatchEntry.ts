"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type PatchEntryPayload = {
  title?: string;
  description?: string;
  calories?: number;
  eaten_at?: string;
  ingredients?: Array<{ name: string; weight_grams?: number | null }>;
};

export const INTERNAL__usePatchEntry = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: PatchEntryPayload;
    }) => {
      const response = await untypedApiClient.PATCH("/api/entries/{id}/", {
        params: { path: { id } },
        body: payload,
      });
      if (response.error)
        throw new Error("Failed to update entry", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.entries._def });
      queryClient.invalidateQueries({ queryKey: queries.dashboard._def });
      onSuccess?.();
    },
  });
};
