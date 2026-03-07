"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await untypedApiClient.DELETE(`/api/categories/${id}/`);
      if (response.error)
        throw new Error("Failed to delete category", { cause: response.error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.meals.categories.queryKey });
    },
  });
};
