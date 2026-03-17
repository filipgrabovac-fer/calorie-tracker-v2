"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mealsApi } from "../_meals.api";
import { MealForm } from "../meal-form/MealForm.component";

type Ingredient = {
  id: number;
  name: string;
  weight_grams: string | null;
};

export type MealCardProps = {
  id: number;
  name: string;
  calories: number;
  categoryId: number;
  ingredients: Ingredient[];
  image_url?: string | null;
};

export const MealCard = ({ id, name, calories, categoryId, ingredients, image_url }: MealCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { mutate: deleteMeal, isPending: isDeleting } = mealsApi.useDeleteMeal();

  return (
    <>
      <div
        className={`flex items-center gap-3 py-2.5 px-3 rounded-md border bg-card transition-opacity ${
          isDeleting ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {image_url && (
          <img
            src={image_url}
            alt={name}
            className="w-10 h-10 rounded-md object-cover flex-shrink-0 border border-border"
          />
        )}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium truncate">{name}</span>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {calories} kcal
            </Badge>
          </div>
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ingredients.map((ing) => (
                <span key={ing.id} className="text-xs text-muted-foreground">
                  {ing.name}
                  {ing.weight_grams ? ` (${ing.weight_grams}g)` : ""}
                  {ingredients.indexOf(ing) < ingredients.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 ml-auto shrink-0">
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
            onClick={() => deleteMeal(id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent
          className="sm:max-w-lg max-sm:fixed max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:h-dvh max-sm:rounded-none max-sm:border-0 flex flex-col p-0 gap-0 overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Edit Meal</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4">
            <MealForm
              categoryId={categoryId}
              mealId={id}
              initialValues={{
                name,
                calories,
                ingredients,
              }}
              onSuccess={() => setIsEditOpen(false)}
              onCancel={() => setIsEditOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
