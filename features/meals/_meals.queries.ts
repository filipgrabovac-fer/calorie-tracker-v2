import { createQueryKeys } from "@lukemorales/query-key-factory";
import { untypedApiClient } from "@/app/schema/apiClient";

export const mealsKeys = createQueryKeys("meals", {
  categories: {
    queryKey: null,
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/categories/");
      const { error } = response;
      if (error) throw new Error("Failed to fetch categories", { cause: error });
      return response.data;
    },
  },
});
