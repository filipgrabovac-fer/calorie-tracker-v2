"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { INTERNAL__usePostCreateEntry } from "../api_hooks/INTERNAL__usePostCreateEntry";
import type { IngredientPayload } from "../api_hooks/INTERNAL__usePostCreateEntry";

type AddEntryFormProps = {
  person_type: "filip" | "klara";
  onSuccess?: () => void;
};

export const AddEntryForm = ({ person_type, onSuccess }: AddEntryFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<IngredientPayload[]>([
    { name: "", weight_grams: null },
  ]);

  const handleSuccess = () => {
    setTitle("");
    setDescription("");
    setCalories("");
    setImage(null);
    setIngredients([{ name: "", weight_grams: null }]);
    onSuccess?.();
  };

  const { mutate: createEntry, isPending } = INTERNAL__usePostCreateEntry(handleSuccess);

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
    createEntry({
      person_type,
      title: title.trim(),
      description: description.trim() || undefined,
      calories: Number(calories),
      image,
      ingredients: validIngredients,
    });
  };

  const isValid = title.trim() !== "" && Number(calories) > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
            <div key={index} className="flex gap-2">
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
        {isPending ? "Saving…" : "Save Entry"}
      </Button>
    </form>
  );
};
