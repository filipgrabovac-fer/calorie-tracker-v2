"use client";

import { Label } from "@/components/ui/label";
import { goalsApi } from "../_goals.api";

type AutoAddToggleProps = {
  person_type: string;
};

export const AutoAddToggle = ({ person_type }: AutoAddToggleProps) => {
  const { data: goal, isLoading } = goalsApi.useGetGoal(person_type);
  const { mutate: patchGoal, isPending } = goalsApi.usePatchGoal();

  const enabled = (goal as any)?.auto_add_meal_plan ?? false;

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor="auto-add-toggle" className="text-sm font-medium">
          Auto-add today&apos;s meal plan
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5">
          When enabled, you&apos;ll be prompted to add today&apos;s planned meals to your log when
          you open the Meal Plan page.
        </p>
      </div>
      <input
        id="auto-add-toggle"
        type="checkbox"
        checked={enabled}
        disabled={isPending}
        onChange={() => patchGoal({ person_type, auto_add_meal_plan: !enabled })}
        className="h-4 w-4 rounded accent-primary cursor-pointer disabled:cursor-not-allowed"
      />
    </div>
  );
};
