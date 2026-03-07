import { INTERNAL__useGetCategories } from "./api_hooks/INTERNAL__useGetCategories";
import { INTERNAL__usePostCreateCategory } from "./api_hooks/INTERNAL__usePostCreateCategory";
import { INTERNAL__usePatchCategory } from "./api_hooks/INTERNAL__usePatchCategory";
import { INTERNAL__useDeleteCategory } from "./api_hooks/INTERNAL__useDeleteCategory";
import { INTERNAL__usePostCreateMeal } from "./api_hooks/INTERNAL__usePostCreateMeal";
import { INTERNAL__usePatchMeal } from "./api_hooks/INTERNAL__usePatchMeal";
import { INTERNAL__useDeleteMeal } from "./api_hooks/INTERNAL__useDeleteMeal";
import { INTERNAL__usePostCreateEntryFromMeal } from "./api_hooks/INTERNAL__usePostCreateEntryFromMeal";

export const mealsApi = {
  useGetCategories: INTERNAL__useGetCategories,
  usePostCreateCategory: INTERNAL__usePostCreateCategory,
  usePatchCategory: INTERNAL__usePatchCategory,
  useDeleteCategory: INTERNAL__useDeleteCategory,
  usePostCreateMeal: INTERNAL__usePostCreateMeal,
  usePatchMeal: INTERNAL__usePatchMeal,
  useDeleteMeal: INTERNAL__useDeleteMeal,
  usePostCreateEntryFromMeal: INTERNAL__usePostCreateEntryFromMeal,
};
