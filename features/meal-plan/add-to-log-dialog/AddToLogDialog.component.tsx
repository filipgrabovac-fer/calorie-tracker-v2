"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mealsApi } from "@/features/meals/_meals.api";

type AddToLogDialogProps = {
  mealName: string;
  mealCalories: number;
  predefined_meal_id: number;
  person_type: string;
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function toNoonISOString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}T12:00:00`;
}

export const AddToLogDialog = ({
  mealName,
  mealCalories,
  predefined_meal_id,
  person_type,
  date,
  open,
  onOpenChange,
}: AddToLogDialogProps) => {
  const { mutate: createEntry, isPending } = mealsApi.usePostCreateEntryFromMeal(() =>
    onOpenChange(false)
  );

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add to log</DialogTitle>
          <DialogDescription>
            Add <strong>{mealName}</strong> ({mealCalories} kcal) to your log for {dateLabel}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            onClick={() =>
              createEntry({
                person_type: person_type as "filip" | "klara",
                predefined_meal: predefined_meal_id,
                eaten_at: toNoonISOString(date),
              })
            }
          >
            {isPending ? "Adding…" : "Add to log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
