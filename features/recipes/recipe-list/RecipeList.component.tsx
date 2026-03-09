"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { recipesApi } from "../_recipes.api";
import { RecipeCard } from "../recipe-card/RecipeCard.component";
import { RecipeForm } from "../recipe-form/RecipeForm.component";

export const RecipeList = () => {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const { data: recipes, isLoading, isError } = recipesApi.useGetRecipes();

    if (isLoading) {
        return <p className="text-sm text-muted-foreground">Loading recipes…</p>;
    }

    if (isError) {
        return <p className="text-sm text-destructive">Failed to load recipes. Please try again.</p>;
    }

    const recipeList = (recipes as any[]) ?? [];

    return (
        <>
            {recipeList.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <p className="text-muted-foreground text-sm">No recipes yet.</p>
                    <Button variant="outline" onClick={() => setIsAddOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add your first recipe
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipeList.map((recipe: any) => (
                            <RecipeCard
                                key={recipe.id}
                                id={recipe.id}
                                title={recipe.title}
                                description={recipe.description ?? ""}
                                ingredients={recipe.ingredients ?? []}
                                steps={recipe.steps ?? []}
                            />
                        ))}
                    </div>
                    <div className="pt-2">
                        <Button variant="outline" onClick={() => setIsAddOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Recipe
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New Recipe</DialogTitle>
                    </DialogHeader>
                    <RecipeForm onSuccess={() => setIsAddOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
};
