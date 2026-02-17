import { createQueryKeys } from "@lukemorales/query-key-factory";
import { untypedApiClient } from "@/app/schema/apiClient";

export const entriesKeys = createQueryKeys("entries", {
  list: (filters: { person_type: string; year: number; month: number }) => ({
    queryKey: [filters],
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/entries/", {
        params: { query: filters },
      });
      const { error } = response;
      if (error) throw new Error("Failed to fetch entries", { cause: error });
      return response.data;
    },
  }),
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/entries/{id}/", {
        params: { path: { id } },
      });
      const { error } = response;
      if (error) throw new Error("Failed to fetch entry", { cause: error });
      return response.data;
    },
  }),
});
