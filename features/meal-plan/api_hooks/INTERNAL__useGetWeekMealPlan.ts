"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";

export const INTERNAL__useGetWeekMealPlan = (params: {
  person_type: string;
  week_start: string;
}) => {
  return useQuery({ ...queries.mealPlan.week(params) });
};
