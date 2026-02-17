"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await untypedApiClient.DELETE("/api/entries/{id}/", {
        params: { path: { id } },
      });
      if (response.error)
        throw new Error("Failed to delete entry", { cause: response.error });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queries.entries._def });
      queryClient.invalidateQueries({ queryKey: queries.dashboard._def });
    },
  });
};
