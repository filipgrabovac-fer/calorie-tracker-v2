"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";

export const INTERNAL__useGetGoal = (person_type: string) => {
  return useQuery({
    ...queries.goals.byPerson(person_type),
    enabled: !!person_type,
  });
};
