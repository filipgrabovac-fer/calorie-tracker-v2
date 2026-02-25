import { INTERNAL__useDeleteEntry } from "./api_hooks/INTERNAL__useDeleteEntry";
import { INTERNAL__useGetEntries } from "./api_hooks/INTERNAL__useGetEntries";
import { INTERNAL__usePatchEntry } from "./api_hooks/INTERNAL__usePatchEntry";
import { INTERNAL__usePostCreateEntry } from "./api_hooks/INTERNAL__usePostCreateEntry";

export const entriesApi = {
  useGetEntries: INTERNAL__useGetEntries,
  usePostCreateEntry: INTERNAL__usePostCreateEntry,
  usePatchEntry: INTERNAL__usePatchEntry,
  useDeleteEntry: INTERNAL__useDeleteEntry,
};
