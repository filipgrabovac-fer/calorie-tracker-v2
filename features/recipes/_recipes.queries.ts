import { createQueryKeys } from "@lukemorales/query-key-factory";
import { untypedApiClient } from "@/app/schema/apiClient";

export const recipesKeys = createQueryKeys("recipes", {
    list: {
        queryKey: null,
        queryFn: async () => {
            const response = await untypedApiClient.GET("/api/recipes/");
            if (response.error) throw new Error("Failed to fetch recipes", { cause: response.error });
            return response.data;
        },
    },
});
