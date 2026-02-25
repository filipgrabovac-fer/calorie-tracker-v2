"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INTERNAL__usePatchEntry } from "../api_hooks/INTERNAL__usePatchEntry";
import { INTERNAL__usePostCreateEntry } from "../api_hooks/INTERNAL__usePostCreateEntry";
import type { IngredientPayload } from "../api_hooks/INTERNAL__usePostCreateEntry";

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function toTimeInputValue(d: Date): string {
  return d.toTimeString().slice(0, 5);
}

function toISODateTime(dateStr: string, timeStr: string): string {
  return `${dateStr}T${timeStr}:00`;
}

export type EntryInitialValues = {
  title: string;
  description?: string;
  calories: number;
  eaten_at: string;
  ingredients: Array<{ id?: number; name: string; weight_grams?: string | number | null }>;
};

type AddEntryFormProps = {
  person_type: "filip" | "klara";
  defaultDate?: Date;
  entryId?: number;
  initialValues?: EntryInitialValues;
  onSuccess?: () => void;
};

export const AddEntryForm = ({
  person_type,
  defaultDate,
  entryId,
  initialValues,
  onSuccess,
}: AddEntryFormProps) => {
  const initialDate = defaultDate ?? new Date();
  const isEditMode = entryId != null && initialValues != null;

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [calories, setCalories] = useState(
    initialValues?.calories != null ? String(initialValues.calories) : ""
  );
  const [dateValue, setDateValue] = useState(() => {
    if (initialValues?.eaten_at) {
      return initialValues.eaten_at.slice(0, 10);
    }
    return toDateInputValue(initialDate);
  });
  const [timeValue, setTimeValue] = useState(() => {
    if (initialValues?.eaten_at) {
      return initialValues.eaten_at.slice(11, 16);
    }
    return toTimeInputValue(initialDate);
  });
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<IngredientPayload[]>(() => {
    if (initialValues?.ingredients?.length) {
      return initialValues.ingredients.map((ing) => ({
        name: ing.name,
        weight_grams: ing.weight_grams != null ? Number(ing.weight_grams) : null,
      }));
    }
    return [{ name: "", weight_grams: null }];
  });

  useEffect(() => {
    if (entryId != null && initialValues) {
      setTitle(initialValues.title ?? "");
      setDescription(initialValues.description ?? "");
      setCalories(initialValues.calories != null ? String(initialValues.calories) : "");
      setDateValue(initialValues.eaten_at?.slice(0, 10) ?? toDateInputValue(new Date()));
      setTimeValue(initialValues.eaten_at?.slice(11, 16) ?? toTimeInputValue(new Date()));
      setIngredients(
        initialValues.ingredients?.length
          ? initialValues.ingredients.map((ing) => ({
              name: ing.name,
              weight_grams: ing.weight_grams != null ? Number(ing.weight_grams) : null,
            }))
          : [{ name: "", weight_grams: null }]
      );
    }
  }, [entryId, initialValues]);

  const handleSuccess = () => {
    setTitle("");
    setDescription("");
    setCalories("");
    setDateValue(toDateInputValue(new Date()));
    setTimeValue(toTimeInputValue(new Date()));
    setImage(null);
    setIngredients([{ name: "", weight_grams: null }]);
    onSuccess?.();
  };

  const { mutate: createEntry, isPending: isCreatePending } =
    INTERNAL__usePostCreateEntry(isEditMode ? undefined : handleSuccess);
  const { mutate: patchEntry, isPending: isPatchPending } =
    INTERNAL__usePatchEntry(isEditMode ? handleSuccess : undefined);

  const isPending = isCreatePending || isPatchPending;

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", weight_grams: null }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof IngredientPayload,
    value: string
  ) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index
          ? {
              ...ing,
              [field]:
                field === "weight_grams"
                  ? value === ""
                    ? null
                    : Number(value)
                  : value,
            }
          : ing
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validIngredients = ingredients.filter((ing) => ing.name.trim() !== "");
    if (isEditMode && entryId != null) {
      patchEntry({
        id: entryId,
        payload: {
          title: title.trim(),
          description: description.trim() || undefined,
          calories: Number(calories),
          eaten_at: toISODateTime(dateValue, timeValue),
          ingredients: validIngredients,
        },
      });
    } else {
      createEntry({
        person_type,
        title: title.trim(),
        description: description.trim() || undefined,
        calories: Number(calories),
        eaten_at: toISODateTime(dateValue, timeValue),
        image,
        ingredients: validIngredients,
      });
    }
  };

  const isValid = title.trim() !== "" && Number(calories) > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="text-sm font-medium">Date *</Label>
          <Input
            id="date"
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="min-h-11 sm:min-h-0"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="time" className="text-sm font-medium">Time</Label>
          <Input
            id="time"
            type="time"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            className="min-h-11 sm:min-h-0"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
        <Input
          id="title"
          placeholder="e.g. Chicken salad"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
        <Textarea
          id="description"
          placeholder="Optional notes about this meal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="calories" className="text-sm font-medium">Calories *</Label>
        <Input
          id="calories"
          type="number"
          min="0"
          placeholder="e.g. 450"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Ingredients</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addIngredient}>
            + Add
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {ingredients.map((ing, index) => (
            <div key={`ing-${index}-${ing.name || "new"}`} className="flex gap-2">
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
                onChange={(e) =>
                  updateIngredient(index, "weight_grams", e.target.value)
                }
                className="w-28 sm:w-32"
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

      <div className="flex flex-col gap-2">
        <Label htmlFor="image" className="text-sm font-medium">Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button type="submit" disabled={!isValid || isPending} className="w-full mt-2">
        {isPending ? "Saving…" : isEditMode ? "Update Entry" : "Save Entry"}
      </Button>
    </form>
  );
};
