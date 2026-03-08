"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { goalsApi } from "../_goals.api";

type EstimationNotesFormProps = {
  person_type: string;
};

export const EstimationNotesForm = ({ person_type }: EstimationNotesFormProps) => {
  const { data: goal, isLoading } = goalsApi.useGetGoal(person_type);
  const { mutate: patchGoal, isPending } = goalsApi.usePatchGoal();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (goal) {
      setValue((goal as any).estimation_notes ?? "");
    }
  }, [goal]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    patchGoal({ person_type, estimation_notes: value });
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`estimation-notes-${person_type}`} className="text-sm">
          Notes
        </Label>
        <Textarea
          id={`estimation-notes-${person_type}`}
          placeholder="e.g. I always cook with olive oil. Portions are for 1 person."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
};
