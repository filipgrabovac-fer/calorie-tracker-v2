"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queries } from "@/api/queries";
import { untypedApiClient } from "@/app/schema/apiClient";

export const INTERNAL__usePatchGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      person_type,
      daily_goal_calories,
    }: {
      person_type: string;
      daily_goal_calories: number;
    }) => {
      const response = await untypedApiClient.PATCH("/api/goals/by-person/", {
        params: { query: { person_type } },
        body: { daily_goal_calories },
      });
      if (response.error)
        throw new Error("Failed to update goal", { cause: response.error });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queries.goals.byPerson(variables.person_type).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: queries.dashboard._def });
    },
  });
};
