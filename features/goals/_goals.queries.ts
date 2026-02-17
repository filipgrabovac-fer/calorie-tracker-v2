import { createQueryKeys } from "@lukemorales/query-key-factory";
import { untypedApiClient } from "@/app/schema/apiClient";

export const goalsKeys = createQueryKeys("goals", {
  byPerson: (person_type: string) => ({
    queryKey: [person_type],
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/goals/by-person/", {
        params: { query: { person_type } },
      });
      const { error } = response;
      if (error) throw new Error("Failed to fetch goal", { cause: error });
      return response.data;
    },
  }),
});
