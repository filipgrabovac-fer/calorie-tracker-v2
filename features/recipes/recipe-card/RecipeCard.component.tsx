"use client";

import { useState } from "react";
import { Pencil, Trash2, ChefHat, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { mutate: deleteRecipe, isPending: isDeleting } = recipesApi.useDeleteRecipe();

    return (
        <>
            <Card
                className={`flex flex-col transition-opacity cursor-pointer hover:border-foreground/20 ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => setIsDetailOpen(true)}
            >
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-snug">{title}</CardTitle>
                        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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

            {/* Detail view */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-5">
                        {description && (
                            <p className="text-sm text-muted-foreground">{description}</p>
                        )}

                        {ingredients.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold">Ingredients</h3>
                                </div>
                                <ul className="flex flex-col gap-1.5">
                                    {ingredients.map((ing) => (
                                        <li key={ing.id} className="flex items-center justify-between text-sm">
                                            <span>{ing.name}</span>
                                            {ing.amount && (
                                                <span className="text-muted-foreground text-xs">{ing.amount}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {ingredients.length > 0 && steps.length > 0 && <Separator />}

                        {steps.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <ListOrdered className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="text-sm font-semibold">Steps</h3>
                                </div>
                                <ol className="flex flex-col gap-4">
                                    {steps.map((step, index) => (
                                        <li key={step.id} className="flex gap-3">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center font-medium mt-0.5">
                                                {index + 1}
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium">{step.title}</span>
                                                {step.description && (
                                                    <span className="text-sm text-muted-foreground">{step.description}</span>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <Separator />
                        <Button
                            variant="outline"
                            size="sm"
                            className="self-start"
                            onClick={() => {
                                setIsDetailOpen(false);
                                setIsEditOpen(true);
                            }}
                        >
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Edit Recipe
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit form */}
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
