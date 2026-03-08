"use client";

import { useQuery } from "@tanstack/react-query";
import { queries } from "@/api/queries";

export const INTERNAL__useGetAllEntries = (person_type: string) => {
  return useQuery({
    ...queries.entries.listAll({ person_type }),
  });
};
