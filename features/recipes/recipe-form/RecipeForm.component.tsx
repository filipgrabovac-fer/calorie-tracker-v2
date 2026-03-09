"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { recipesApi } from "../_recipes.api";
import type { CreateRecipePayload } from "../api_hooks/INTERNAL__usePostCreateRecipe";

type IngredientRow = {
    name: string;
    amount: string;
    _key: string;
};

type StepRow = {
    title: string;
    description: string;
    _key: string;
};

export type RecipeFormProps = {
    recipeId?: number;
    initialValues?: {
        title: string;
        description: string;
        ingredients: Array<{ name: string; amount: string }>;
        steps: Array<{ title: string; description: string }>;
    };
    onSuccess?: () => void;
};

export const RecipeForm = ({ recipeId, initialValues, onSuccess }: RecipeFormProps) => {
    const isEditMode = recipeId != null;
    const nextKeyRef = useRef(0);

    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(initialValues?.description ?? "");

    const [ingredients, setIngredients] = useState<IngredientRow[]>(() => {
        if (initialValues?.ingredients?.length) {
            return initialValues.ingredients.map((ing, i) => ({
                name: ing.name,
                amount: ing.amount ?? "",
                _key: `ing-init-${i}`,
            }));
        }
        return [{ name: "", amount: "", _key: "ing-0" }];
    });

    const [steps, setSteps] = useState<StepRow[]>(() => {
        if (initialValues?.steps?.length) {
            return initialValues.steps.map((step, i) => ({
                title: step.title,
                description: step.description ?? "",
                _key: `step-init-${i}`,
            }));
        }
        return [{ title: "", description: "", _key: "step-0" }];
    });

    const { mutate: createRecipe, isPending: isCreatePending } = recipesApi.usePostCreateRecipe(onSuccess);
    const { mutate: patchRecipe, isPending: isPatchPending } = recipesApi.usePatchRecipe(onSuccess);
    const isPending = isCreatePending || isPatchPending;

    const addIngredient = () => {
        nextKeyRef.current += 1;
        setIngredients((prev) => [...prev, { name: "", amount: "", _key: `ing-${nextKeyRef.current}` }]);
    };

    const removeIngredient = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const updateIngredient = (index: number, field: "name" | "amount", value: string) => {
        setIngredients((prev) =>
            prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
        );
    };

    const addStep = () => {
        nextKeyRef.current += 1;
        setSteps((prev) => [...prev, { title: "", description: "", _key: `step-${nextKeyRef.current}` }]);
    };

    const removeStep = (index: number) => {
        setSteps((prev) => prev.filter((_, i) => i !== index));
    };

    const updateStep = (index: number, field: "title" | "description", value: string) => {
        setSteps((prev) =>
            prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validIngredients = ingredients
            .filter((ing) => ing.name.trim() !== "")
            .map(({ name: ingName, amount }) => ({ name: ingName, amount }));
        const validSteps = steps
            .filter((step) => step.title.trim() !== "")
            .map(({ title: stepTitle, description: stepDesc }) => ({
                title: stepTitle,
                description: stepDesc,
            }));

        if (isEditMode && recipeId != null) {
            patchRecipe({
                id: recipeId,
                payload: {
                    title: title.trim(),
                    description,
                    ingredients: validIngredients,
                    steps: validSteps,
                },
            });
        } else {
            const payload: CreateRecipePayload = {
                title: title.trim(),
                description,
                ingredients: validIngredients,
                steps: validSteps,
            };
            createRecipe(payload);
        }
    };

    const isValid = title.trim() !== "";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <Label htmlFor="recipe-title" className="text-sm font-medium">
                    Title *
                </Label>
                <Input
                    id="recipe-title"
                    placeholder="e.g. Grandma's Pasta"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    autoFocus
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="recipe-description" className="text-sm font-medium">
                    Description
                </Label>
                <Textarea
                    id="recipe-description"
                    placeholder="Short description of the recipe…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="resize-none"
                />
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Ingredients</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addIngredient}>
                        + Add
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    {ingredients.map((ing, index) => (
                        <div key={ing._key} className="flex gap-2">
                            <Input
                                placeholder="Name"
                                value={ing.name}
                                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                                className="flex-1"
                            />
                            <Input
                                placeholder="Amount (e.g. 200g)"
                                value={ing.amount}
                                onChange={(e) => updateIngredient(index, "amount", e.target.value)}
                                className="w-36"
                            />
                            {ingredients.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeIngredient(index)}
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Steps</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={addStep}>
                        + Add
                    </Button>
                </div>
                <div className="flex flex-col gap-3">
                    {steps.map((step, index) => (
                        <div key={step._key} className="flex gap-2">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Input
                                    placeholder={`Step ${index + 1} title`}
                                    value={step.title}
                                    onChange={(e) => updateStep(index, "title", e.target.value)}
                                />
                                <Textarea
                                    placeholder="Instructions…"
                                    value={step.description}
                                    onChange={(e) => updateStep(index, "description", e.target.value)}
                                    rows={2}
                                    className="resize-none text-sm"
                                />
                            </div>
                            {steps.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 self-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeStep(index)}
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Button type="submit" disabled={!isValid || isPending} className="mt-1">
                {isPending ? "Saving…" : isEditMode ? "Update Recipe" : "Add Recipe"}
            </Button>
        </form>
    );
};
