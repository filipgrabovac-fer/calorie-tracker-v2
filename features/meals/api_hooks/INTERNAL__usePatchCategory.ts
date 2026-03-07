"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__usePatchCategory = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: number; name: string }) => {
      const response = await untypedApiClient.PATCH(`/api/categories/${id}/`, {
        body: { name },
      });
      if (response.error)
        throw new Error("Failed to update category", { cause: response.error });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.meals.categories.queryKey });
      onSuccess?.();
    },
  });
};
