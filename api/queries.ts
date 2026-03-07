import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { dashboardKeys } from "@/features/dashboard/_dashboard.queries";
import { entriesKeys } from "@/features/entries/_entries.queries";
import { goalsKeys } from "@/features/goals/_goals.queries";
import { mealsKeys } from "@/features/meals/_meals.queries";

export const queries = mergeQueryKeys(entriesKeys, dashboardKeys, goalsKeys, mealsKeys);
