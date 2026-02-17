"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { AddEntryForm } from "@/features/entries/add-entry-form/AddEntryForm.component";

export default function AddEntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const handleSuccess = () => {
    router.push(`/${slug}/entries`);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold">Add Entry</h2>
        <p className="text-sm text-muted-foreground mt-1">Record a new meal or snack</p>
      </div>
      <Card>
        <CardContent className="p-4 sm:p-6">
          <AddEntryForm
            person_type={slug as "filip" | "klara"}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
