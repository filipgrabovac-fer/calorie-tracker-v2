"use client";

import { useEffect, useState } from "react";
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
import { mealPlanApi } from "../_meal-plan.api";
import type { MealPlanEntry } from "../_meal-plan.queries";

type MealPlanAutoAddCheckerProps = {
  person_type: string;
  autoAddEnabled: boolean;
};

function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toNoonISOString(dateStr: string): string {
  return `${dateStr}T12:00:00`;
}

function getStorageKey(person_type: string, dateStr: string): string {
  return `meal-plan-auto-add-shown-${person_type}-${dateStr}`;
}

export const MealPlanAutoAddChecker = ({
  person_type,
  autoAddEnabled,
}: MealPlanAutoAddCheckerProps) => {
  const todayStr = getTodayString();
  const storageKey = getStorageKey(person_type, todayStr);
  const alreadyShown =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) === "true" : true;

  const shouldFetch = autoAddEnabled && !alreadyShown;

  const { data: unprocessed } = mealPlanApi.useGetTodayUnprocessed(
    { person_type, date: todayStr },
    shouldFetch
  );

  const [open, setOpen] = useState(false);
  const [handled, setHandled] = useState(false);

  const { mutateAsync: createEntry } = mealsApi.usePostCreateEntryFromMeal();
  const { mutate: markProcessed, isPending: isMarkPending } =
    mealPlanApi.usePostMarkProcessed(() => {
      localStorage.setItem(storageKey, "true");
      setOpen(false);
    });

  const plans = (unprocessed as MealPlanEntry[] | undefined) ?? [];

  useEffect(() => {
    if (shouldFetch && plans.length > 0 && !handled) {
      setOpen(true);
      setHandled(true);
    }
  }, [plans, shouldFetch, handled]);

  if (!shouldFetch || plans.length === 0) return null;

  const handleAddAll = async () => {
    try {
      await Promise.all(
        plans.map((plan) =>
          createEntry({
            person_type: person_type as "filip" | "klara",
            predefined_meal: plan.predefined_meal,
            eaten_at: toNoonISOString(plan.date),
          })
        )
      );
    } finally {
      markProcessed(plans.map((p) => p.id));
    }
  };

  const handleDismiss = () => {
    markProcessed(plans.map((p) => p.id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Today&apos;s Meal Plan</DialogTitle>
          <DialogDescription>
            You have {plans.length} planned meal{plans.length !== 1 ? "s" : ""} for today. Add
            them to your log?
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-1 text-sm">
          {plans.map((plan) => (
            <li key={plan.id} className="flex items-center justify-between">
              <span>{plan.predefined_meal_name}</span>
              <span className="text-muted-foreground text-xs">{plan.predefined_meal_calories} kcal</span>
            </li>
          ))}
        </ul>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleDismiss} disabled={isMarkPending}>
            Dismiss
          </Button>
          <Button onClick={handleAddAll} disabled={isMarkPending}>
            {isMarkPending ? "Adding…" : "Add All"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
