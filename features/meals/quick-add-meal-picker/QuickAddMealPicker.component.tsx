"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mealsApi } from "../_meals.api";

type QuickAddMealPickerProps = {
  person_type: "filip" | "klara";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const QuickAddMealPicker = ({
  person_type,
  open,
  onOpenChange,
}: QuickAddMealPickerProps) => {
  const { data: categories, isLoading } = mealsApi.useGetCategories();
  const { mutate: createEntryFromMeal, isPending } = mealsApi.usePostCreateEntryFromMeal(() =>
    onOpenChange(false)
  );

  const handleSelect = (mealId: number) => {
    createEntryFromMeal({
      person_type,
      predefined_meal: mealId,
      eaten_at: new Date().toISOString(),
    });
  };

  const allCategories = (categories as any[]) ?? [];
  const hasMeals = allCategories.some((cat: any) => cat.meals?.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add from Meal</DialogTitle>
          <DialogDescription>
            Select a predefined meal to add today&apos;s entry instantly.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">Loading meals…</p>
          )}

          {!isLoading && !hasMeals && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No predefined meals yet. Create some on the Meals page.
            </p>
          )}

          {!isLoading &&
            allCategories.map((category: any) => {
              if (!category.meals?.length) return null;
              return (
                <div key={category.id} className="flex flex-col gap-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {category.name}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {category.meals.map((meal: any) => (
                      <button
                        key={meal.id}
                        type="button"
                        disabled={isPending}
                        className="flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-md border bg-card hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleSelect(meal.id)}
                      >
                        <span className="text-sm font-medium truncate">{meal.name}</span>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {meal.calories} kcal
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
