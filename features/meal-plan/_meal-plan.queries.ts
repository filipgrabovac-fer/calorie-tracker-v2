import { createQueryKeys } from "@lukemorales/query-key-factory";
import { untypedApiClient } from "@/app/schema/apiClient";

export const mealPlanKeys = createQueryKeys("mealPlan", {
  week: (params: { person_type: string; week_start: string }) => ({
    queryKey: [params],
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/meal-plans/", {
        params: { query: { person_type: params.person_type, week_start: params.week_start } },
      });
      const { error } = response;
      if (error) throw new Error("Failed to fetch meal plan", { cause: error });
      return response.data as MealPlanEntry[];
    },
  }),
  todayUnprocessed: (params: { person_type: string; date: string }) => ({
    queryKey: [params],
    queryFn: async () => {
      const response = await untypedApiClient.GET("/api/meal-plans/", {
        params: {
          query: { person_type: params.person_type, date: params.date, is_processed: "false" },
        },
      });
      const { error } = response;
      if (error) throw new Error("Failed to fetch unprocessed meal plans", { cause: error });
      return response.data as MealPlanEntry[];
    },
  }),
});

export type MealPlanEntry = {
  id: number;
  person_type: string;
  date: string;
  predefined_meal: number;
  predefined_meal_name: string;
  predefined_meal_calories: number;
  is_processed: boolean;
  created_at: string;
};
