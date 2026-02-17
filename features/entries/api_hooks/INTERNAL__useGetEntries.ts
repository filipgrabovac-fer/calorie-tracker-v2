"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";

export const INTERNAL__useGetEntries = (params: {
  person_type: string;
  year: number;
  month: number;
}) => {
  return useQuery({
    ...queries.entries.list(params),
    enabled: !!params.person_type,
  });
};
