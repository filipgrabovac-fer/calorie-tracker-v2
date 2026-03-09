"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type CreateRecipePayload = {
    title: string;
    description?: string;
    ingredients?: Array<{ name: string; amount?: string }>;
    steps?: Array<{ title: string; description?: string }>;
};

export const INTERNAL__usePostCreateRecipe = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateRecipePayload) => {
            const response = await untypedApiClient.POST("/api/recipes/", { body: payload });
            if (response.error) throw new Error("Failed to create recipe", { cause: response.error });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queries.recipes.list.queryKey });
            onSuccess?.();
        },
    });
};
