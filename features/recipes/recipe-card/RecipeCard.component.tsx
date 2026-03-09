"use client";

import { useState } from "react";
import { Pencil, Trash2, ChefHat, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { recipesApi } from "../_recipes.api";
import { RecipeForm } from "../recipe-form/RecipeForm.component";

type RecipeIngredient = {
    id: number;
    name: string;
    amount: string;
};

type RecipeStep = {
    id: number;
    title: string;
    description: string;
};

export type RecipeCardProps = {
    id: number;
    title: string;
    description: string;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
};

export const RecipeCard = ({ id, title, description, ingredients, steps }: RecipeCardProps) => {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { mutate: deleteRecipe, isPending: isDeleting } = recipesApi.useDeleteRecipe();

    return (
        <>
            <Card
                className={`flex flex-col transition-opacity ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug">{title}</CardTitle>
                        <div className="flex items-center gap-1 shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                onClick={() => setIsEditOpen(true)}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteRecipe(id)}
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                    {description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
                    )}
                </CardHeader>
                <CardContent className="pt-0 flex flex-col gap-2">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <ChefHat className="h-3.5 w-3.5" />
                            {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                            <ListOrdered className="h-3.5 w-3.5" />
                            {steps.length} step{steps.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    {ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {ingredients.slice(0, 4).map((ing) => (
                                <span
                                    key={ing.id}
                                    className="text-xs bg-muted rounded px-1.5 py-0.5 text-muted-foreground"
                                >
                                    {ing.name}
                                    {ing.amount ? ` · ${ing.amount}` : ""}
                                </span>
                            ))}
                            {ingredients.length > 4 && (
                                <span className="text-xs text-muted-foreground self-center">
                                    +{ingredients.length - 4} more
                                </span>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Recipe</DialogTitle>
                    </DialogHeader>
                    <RecipeForm
                        recipeId={id}
                        initialValues={{ title, description, ingredients, steps }}
                        onSuccess={() => setIsEditOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};
