import { INTERNAL__useGetWeekMealPlan } from "./api_hooks/INTERNAL__useGetWeekMealPlan";
import { INTERNAL__useGetTodayUnprocessed } from "./api_hooks/INTERNAL__useGetTodayUnprocessed";
import { INTERNAL__usePostCreateMealPlan } from "./api_hooks/INTERNAL__usePostCreateMealPlan";
import { INTERNAL__usePostBulkCreateMealPlan } from "./api_hooks/INTERNAL__usePostBulkCreateMealPlan";
import { INTERNAL__useDeleteMealPlan } from "./api_hooks/INTERNAL__useDeleteMealPlan";
import { INTERNAL__usePostBulkDeleteMealPlan } from "./api_hooks/INTERNAL__usePostBulkDeleteMealPlan";
import { INTERNAL__usePostMarkProcessed } from "./api_hooks/INTERNAL__usePostMarkProcessed";

export const mealPlanApi = {
  useGetWeekMealPlan: INTERNAL__useGetWeekMealPlan,
  useGetTodayUnprocessed: INTERNAL__useGetTodayUnprocessed,
  usePostCreateMealPlan: INTERNAL__usePostCreateMealPlan,
  usePostBulkCreateMealPlan: INTERNAL__usePostBulkCreateMealPlan,
  useDeleteMealPlan: INTERNAL__useDeleteMealPlan,
  usePostBulkDeleteMealPlan: INTERNAL__usePostBulkDeleteMealPlan,
  usePostMarkProcessed: INTERNAL__usePostMarkProcessed,
};
