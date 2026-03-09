"use client";

import { RecipeList } from "@/features/recipes/recipe-list/RecipeList.component";

export default function RecipesPage() {
    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Recipes</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Your personal cookbook — create and manage recipes.
                </p>
            </div>
            <RecipeList />
        </div>
    );
}
