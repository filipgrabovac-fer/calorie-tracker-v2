"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { INTERNAL__useGetGoal } from "../api_hooks/INTERNAL__useGetGoal";
import { INTERNAL__usePatchGoal } from "../api_hooks/INTERNAL__usePatchGoal";

type GoalFormProps = {
  person_type: string;
};

export const GoalForm = ({ person_type }: GoalFormProps) => {
  const { data: goal, isLoading } = INTERNAL__useGetGoal(person_type);
  const { mutate: patchGoal, isPending } = INTERNAL__usePatchGoal();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (goal) {
      setValue(String((goal as { daily_goal_calories: number }).daily_goal_calories));
    }
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    patchGoal({ person_type, daily_goal_calories: Number(value) });
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`goal-${person_type}`} className="text-sm font-medium">
          Daily calorie goal for{" "}
          <span className="capitalize font-semibold">{person_type}</span>
        </Label>
        <Input
          id={`goal-${person_type}`}
          type="number"
          min="0"
          placeholder="e.g. 2000"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={isPending || value === ""}
        className="w-fit"
      >
        {isPending ? "Saving…" : "Save Goal"}
      </Button>
    </form>
  );
};
