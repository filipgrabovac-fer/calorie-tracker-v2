"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export type PatchRecipePayload = {
    title?: string;
    description?: string;
    ingredients?: Array<{ name: string; amount?: string }>;
    steps?: Array<{ title: string; description?: string }>;
};

export const INTERNAL__usePatchRecipe = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: number; payload: PatchRecipePayload }) => {
            const response = await untypedApiClient.PATCH(`/api/recipes/${id}/`, { body: payload });
            if (response.error) throw new Error("Failed to update recipe", { cause: response.error });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queries.recipes.list.queryKey });
            onSuccess?.();
        },
    });
};
