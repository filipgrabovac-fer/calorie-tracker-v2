"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mealsApi } from "../_meals.api";
import type { CreateMealPayload } from "../api_hooks/INTERNAL__usePostCreateMeal";
import { INTERNAL__usePostEstimateCalories } from "@/features/entries/api_hooks/INTERNAL__usePostEstimateCalories";

type IngredientRow = {
  name: string;
  weight_grams: number | null;
  _key: string;
};

type MealFormProps = {
  categoryId: number;
  mealId?: number;
  initialValues?: {
    name: string;
    calories: number;
    ingredients: Array<{ name: string; weight_grams?: string | number | null }>;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const MealForm = ({ categoryId, mealId, initialValues, onSuccess, onCancel }: MealFormProps) => {
  const isEditMode = mealId != null;
  const nextKeyRef = useRef(0);

  const [name, setName] = useState(initialValues?.name ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [calories, setCalories] = useState(
    initialValues?.calories != null ? String(initialValues.calories) : ""
  );
  const [ingredients, setIngredients] = useState<IngredientRow[]>(() => {
    if (initialValues?.ingredients?.length) {
      return initialValues.ingredients.map((ing, i) => ({
        name: ing.name,
        weight_grams: ing.weight_grams != null ? Number(ing.weight_grams) : null,
        _key: `ing-init-${i}`,
      }));
    }
    return [{ name: "", weight_grams: null, _key: "ing-0" }];
  });

  const { mutate: createMeal, isPending: isCreatePending } = mealsApi.usePostCreateMeal(onSuccess);
  const { mutate: patchMeal, isPending: isPatchPending } = mealsApi.usePatchMeal(onSuccess);
  const { mutate: estimateCalories, isPending: isEstimatePending } =
    INTERNAL__usePostEstimateCalories((data) => setCalories(String(data.estimated_calories)));

  const isPending = isCreatePending || isPatchPending;
  const validIngredientsForEstimate = ingredients.filter((ing) => ing.name.trim() !== "");

  const addIngredient = () => {
    nextKeyRef.current += 1;
    setIngredients((prev) => [
      ...prev,
      { name: "", weight_grams: null, _key: `ing-${nextKeyRef.current}` },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: "name" | "weight_grams", value: string) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index
          ? {
              ...ing,
              [field]: field === "weight_grams" ? (value === "" ? null : Number(value)) : value,
            }
          : ing
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = ingredients
      .filter((ing) => ing.name.trim() !== "")
      .map(({ name: ingName, weight_grams }) => ({ name: ingName, weight_grams }));

    if (isEditMode && mealId != null) {
      patchMeal({
        id: mealId,
        payload: {
          name: name.trim(),
          calories: Number(calories),
          category: categoryId,
          ingredients: validIngredients,
          image,
        },
      });
    } else {
      const payload: CreateMealPayload = {
        name: name.trim(),
        calories: Number(calories),
        category: categoryId,
        ingredients: validIngredients,
        image,
      };
      createMeal(payload);
    }
  };

  const isValid = name.trim() !== "" && Number(calories) > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <fieldset disabled={isEstimatePending} className="contents">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meal-name" className="text-sm font-medium">
            Meal name *
          </Label>
          <Input
            id="meal-name"
            placeholder="e.g. Oatmeal with berries"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meal-calories" className="text-sm font-medium">
            Calories *
          </Label>
          <div className="flex gap-2">
            <Input
              id="meal-calories"
              type="number"
              min="0"
              placeholder="e.g. 350"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="button"
              variant="secondary"
              disabled={validIngredientsForEstimate.length === 0}
              onClick={() =>
                estimateCalories({
                  title: name.trim() || undefined,
                  ingredients: validIngredientsForEstimate.map(({ name: ingName, weight_grams }) => ({
                    name: ingName,
                    weight_grams,
                  })),
                })
              }
            >
              {isEstimatePending ? "Estimating…" : "Estimate with AI"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
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
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Weight (g)"
                  value={ing.weight_grams ?? ""}
                  onChange={(e) => updateIngredient(index, "weight_grams", e.target.value)}
                  className="w-24 sm:w-28"
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meal-image" className="text-sm font-medium">Image</Label>
          <Input
            id="meal-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-2 pt-1">
        <Button type="submit" disabled={!isValid || isPending || isEstimatePending} className="w-full">
          {isPending ? "Saving…" : isEditMode ? "Update Meal" : "Add Meal"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
