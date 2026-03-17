"use client";

import { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { goalsApi } from "@/features/goals/_goals.api";
import { entriesApi } from "../_entries.api";
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
  onCancel?: () => void;
};

export const AddEntryForm = ({
  person_type,
  defaultDate,
  entryId,
  initialValues,
  onSuccess,
  onCancel,
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextIngredientKeyRef = useRef(0);
  const [ingredients, setIngredients] = useState<(IngredientPayload & { _key: string })[]>(() => {
    if (initialValues?.ingredients?.length) {
      return initialValues.ingredients.map((ing, i) => ({
        name: ing.name,
        weight_grams: ing.weight_grams != null ? Number(ing.weight_grams) : null,
        _key: `ing-init-${entryId ?? "new"}-${i}`,
      }));
    }
    return [{ name: "", weight_grams: null, _key: "ing-0" }];
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
          ? initialValues.ingredients.map((ing, i) => ({
              name: ing.name,
              weight_grams: ing.weight_grams != null ? Number(ing.weight_grams) : null,
              _key: `ing-init-${entryId}-${i}`,
            }))
          : [{ name: "", weight_grams: null, _key: "ing-0" }]
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
    setIngredients([{ name: "", weight_grams: null, _key: "ing-0" }]);
    onSuccess?.();
  };

  const { mutate: createEntry, isPending: isCreatePending } =
    INTERNAL__usePostCreateEntry(isEditMode ? undefined : handleSuccess);
  const { mutate: patchEntry, isPending: isPatchPending } =
    INTERNAL__usePatchEntry(isEditMode ? handleSuccess : undefined);
  const { mutate: estimateCalories, isPending: isEstimatePending } =
    entriesApi.usePostEstimateCalories((data) => setCalories(String(data.estimated_calories)));
  const { data: goal } = goalsApi.useGetGoal(person_type);
  const estimationNotes = (goal as any)?.estimation_notes ?? "";

  const isPending = isCreatePending || isPatchPending;
  const validIngredientsForEstimate = ingredients.filter((ing) => ing.name.trim() !== "");
  const hasValidIngredients = validIngredientsForEstimate.length > 0;

  const addIngredient = () => {
    nextIngredientKeyRef.current += 1;
    setIngredients((prev) => [
      ...prev,
      { name: "", weight_grams: null, _key: `ing-${nextIngredientKeyRef.current}` },
    ]);
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
    const validIngredients = ingredients
      .filter((ing) => ing.name.trim() !== "")
      .map(({ name, weight_grams }) => ({ name, weight_grams }));
    if (isEditMode && entryId != null) {
      patchEntry({
        id: entryId,
        payload: {
          title: title.trim(),
          description: description.trim() || undefined,
          calories: Number(calories),
          eaten_at: toISODateTime(dateValue, timeValue),
          ingredients: validIngredients,
          image,
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
  const imagePreviewUrl = image ? URL.createObjectURL(image) : null;

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-col gap-5">
      {/* Image upload — camera-style tap zone */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative w-full h-36 rounded-xl border-2 border-dashed border-border hover:border-primary/60 hover:bg-muted/30 transition-colors overflow-hidden flex items-center justify-center group"
        aria-label="Add photo"
      >
        {imagePreviewUrl ? (
          <>
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
            <Camera className="h-6 w-6" />
            <span className="text-sm font-medium">Add photo</span>
          </div>
        )}
      </button>
      {image && (
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors -mt-3 self-end"
          onClick={() => setImage(null)}
        >
          <X className="h-3 w-3" />
          Remove photo
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />

      <fieldset disabled={isEstimatePending} className="flex min-w-0 flex-col gap-5">
        <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="date" className="text-sm font-medium">Date</Label>
            <Input
              id="date"
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="min-w-0 max-w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:dark:invert"
              required
            />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Label htmlFor="time" className="text-sm font-medium">Time</Label>
            <Input
              id="time"
              type="time"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              className="min-w-0 max-w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:dark:invert"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
          <Input
            id="title"
            placeholder="e.g. Chicken salad"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
          <Textarea
            id="description"
            placeholder="Optional notes about this meal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="calories" className="text-sm font-medium">Calories *</Label>
          <div className="flex gap-2">
            <Input
              id="calories"
              type="number"
              min="0"
              placeholder="e.g. 450"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="flex-1"
              required
            />
            <Button
              type="button"
              variant="secondary"
              disabled={!hasValidIngredients}
              onClick={() => {
                const descParts = [description.trim(), estimationNotes.trim()].filter(Boolean);
                estimateCalories({
                  title: title.trim() || undefined,
                  description: descParts.length ? descParts.join("\n\n") : undefined,
                  ingredients: validIngredientsForEstimate.map(({ name, weight_grams }) => ({
                    name,
                    weight_grams,
                  })),
                });
              }}
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
                  onChange={(e) =>
                    updateIngredient(index, "weight_grams", e.target.value)
                  }
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

        <div className="flex flex-col gap-2 pt-1">
          <Button type="submit" disabled={!isValid || isPending} className="w-full">
            {isPending ? "Saving…" : isEditMode ? "Update Entry" : "Save Entry"}
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
      </fieldset>
    </form>
  );
};
