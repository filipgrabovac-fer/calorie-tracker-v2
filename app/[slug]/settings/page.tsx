"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoalForm } from "@/features/goals/goal-form/GoalForm.component";

export default function SettingsPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Set daily calorie goals per person.
        </p>
      </div>
      <Separator />
      <Card>
        <CardContent className="p-4 sm:p-6">
          <GoalForm person_type={slug} />
        </CardContent>
      </Card>
    </div>
  );
}
