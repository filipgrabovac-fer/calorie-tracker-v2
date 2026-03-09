"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__useDeleteRecipe = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await untypedApiClient.DELETE(`/api/recipes/${id}/`);
            if (response.error) throw new Error("Failed to delete recipe", { cause: response.error });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queries.recipes.list.queryKey });
        },
    });
};
