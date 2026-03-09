import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { dashboardKeys } from "@/features/dashboard/_dashboard.queries";
import { entriesKeys } from "@/features/entries/_entries.queries";
import { goalsKeys } from "@/features/goals/_goals.queries";
import { mealPlanKeys } from "@/features/meal-plan/_meal-plan.queries";
import { mealsKeys } from "@/features/meals/_meals.queries";
import { recipesKeys } from "@/features/recipes/_recipes.queries";

export const queries = mergeQueryKeys(entriesKeys, dashboardKeys, goalsKeys, mealsKeys, mealPlanKeys, recipesKeys);
