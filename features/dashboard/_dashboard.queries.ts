import { createQueryKeys } from "@lukemorales/query-key-factory";
import { untypedApiClient } from "@/app/schema/apiClient";

export const dashboardKeys = createQueryKeys("dashboard", {
  monthly: (params: { person_type: string; year: number; month: number }) => ({
    queryKey: [params],
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/dashboard/", {
        params: { query: params },
      });
      const { error } = response;
      if (error)
        throw new Error("Failed to fetch dashboard data", { cause: error });
      return response.data;
    },
  }),
});
