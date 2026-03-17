"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mealsApi } from "../_meals.api";
import { CategoryForm } from "../category-form/CategoryForm.component";
import { MealCard } from "../meal-card/MealCard.component";
import { MealForm } from "../meal-form/MealForm.component";

type Ingredient = {
  id: number;
  name: string;
  weight_grams: string | null;
};

type Meal = {
  id: number;
  name: string;
  calories: number;
  ingredients: Ingredient[];
  image_url?: string | null;
};

type CategorySectionProps = {
  id: number;
  name: string;
  meals: Meal[];
};

export const CategorySection = ({ id, name, meals }: CategorySectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);

  const { mutate: deleteCategory, isPending: isDeleting } = mealsApi.useDeleteCategory();

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex items-center gap-2 text-left flex-1 min-w-0"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="font-semibold text-base truncate">{name}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {meals.length} {meals.length === 1 ? "meal" : "meals"}
            </span>
          </button>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setIsAddMealOpen(true)}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setIsEditCategoryOpen(true)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => deleteCategory(id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="flex flex-col gap-1.5 pl-6">
            {meals.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                No meals yet.{" "}
                <button
                  type="button"
                  className="underline underline-offset-2 hover:text-foreground"
                  onClick={() => setIsAddMealOpen(true)}
                >
                  Add one
                </button>
              </p>
            ) : (
              meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  id={meal.id}
                  name={meal.name}
                  calories={meal.calories}
                  categoryId={id}
                  ingredients={meal.ingredients}
                  image_url={meal.image_url}
                />
              ))
            )}
          </div>
        )}
      </div>

      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent className="sm:max-w-sm max-sm:fixed max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:h-dvh max-sm:rounded-none max-sm:border-0 flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Rename Category</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4">
            <CategoryForm
              categoryId={id}
              initialName={name}
              onSuccess={() => setIsEditCategoryOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent
          className="sm:max-w-lg max-sm:fixed max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:h-dvh max-sm:rounded-none max-sm:border-0 flex flex-col p-0 gap-0 overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Add Meal to {name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4">
            <MealForm
              categoryId={id}
              onSuccess={() => setIsAddMealOpen(false)}
              onCancel={() => setIsAddMealOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
