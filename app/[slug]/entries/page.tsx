"use client";

import { useParams } from "next/navigation";
import { EntriesList } from "@/features/entries/entries-list/EntriesList.component";

export default function EntriesPage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold capitalize">{slug}&apos;s entries</h2>
        <p className="text-sm text-muted-foreground mt-1">View and manage your meal entries</p>
      </div>

      <EntriesList person_type={slug} />
    </div>
  );
}
