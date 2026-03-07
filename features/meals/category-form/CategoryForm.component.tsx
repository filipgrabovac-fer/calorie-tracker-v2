"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mealsApi } from "../_meals.api";

type CategoryFormProps = {
  categoryId?: number;
  initialName?: string;
  onSuccess?: () => void;
};

export const CategoryForm = ({ categoryId, initialName = "", onSuccess }: CategoryFormProps) => {
  const [name, setName] = useState(initialName);
  const isEditMode = categoryId != null;

  const { mutate: createCategory, isPending: isCreatePending } =
    mealsApi.usePostCreateCategory(onSuccess);
  const { mutate: patchCategory, isPending: isPatchPending } =
    mealsApi.usePatchCategory(onSuccess);

  const isPending = isCreatePending || isPatchPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEditMode && categoryId != null) {
      patchCategory({ id: categoryId, name: name.trim() });
    } else {
      createCategory({ name: name.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="category-name" className="text-sm font-medium">
          Category name *
        </Label>
        <Input
          id="category-name"
          placeholder="e.g. Breakfast, Snacks"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>
      <Button type="submit" disabled={!name.trim() || isPending}>
        {isPending ? "Saving…" : isEditMode ? "Update Category" : "Create Category"}
      </Button>
    </form>
  );
};
