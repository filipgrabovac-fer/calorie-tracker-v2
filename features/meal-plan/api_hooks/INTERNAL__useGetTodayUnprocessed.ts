"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";

export const INTERNAL__useGetTodayUnprocessed = (
  params: { person_type: string; date: string },
  enabled: boolean
) => {
  return useQuery({ ...queries.mealPlan.todayUnprocessed(params), enabled });
};
