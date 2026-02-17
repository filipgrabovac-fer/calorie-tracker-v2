import { INTERNAL__useDeleteEntry } from "./api_hooks/INTERNAL__useDeleteEntry";
import { INTERNAL__useGetEntries } from "./api_hooks/INTERNAL__useGetEntries";
import { INTERNAL__usePostCreateEntry } from "./api_hooks/INTERNAL__usePostCreateEntry";

export const entriesApi = {
  useGetEntries: INTERNAL__useGetEntries,
  usePostCreateEntry: INTERNAL__usePostCreateEntry,
  useDeleteEntry: INTERNAL__useDeleteEntry,
};
