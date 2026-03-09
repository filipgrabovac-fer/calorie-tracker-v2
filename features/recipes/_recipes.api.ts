import { INTERNAL__useGetRecipes } from "./api_hooks/INTERNAL__useGetRecipes";
import { INTERNAL__usePostCreateRecipe } from "./api_hooks/INTERNAL__usePostCreateRecipe";
import { INTERNAL__usePatchRecipe } from "./api_hooks/INTERNAL__usePatchRecipe";
import { INTERNAL__useDeleteRecipe } from "./api_hooks/INTERNAL__useDeleteRecipe";

export const recipesApi = {
    useGetRecipes: INTERNAL__useGetRecipes,
    usePostCreateRecipe: INTERNAL__usePostCreateRecipe,
    usePatchRecipe: INTERNAL__usePatchRecipe,
    useDeleteRecipe: INTERNAL__useDeleteRecipe,
};
