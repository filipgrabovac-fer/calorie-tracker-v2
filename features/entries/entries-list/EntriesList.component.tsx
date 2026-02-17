"use client";

import { INTERNAL__useGetEntries } from "../api_hooks/INTERNAL__useGetEntries";
import { EntryCard } from "../entry-card/EntryCard.component";

type EntriesListProps = {
  person_type: string;
  year: number;
  month: number;
};

export const EntriesList = ({ person_type, year, month }: EntriesListProps) => {
  const { data: entries, isLoading, isError } = INTERNAL__useGetEntries({
    person_type,
    year,
    month,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        Loading entries…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-16 text-destructive text-sm">
        Failed to load entries.
      </div>
    );
  }

  if (!entries || (entries as unknown[]).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
        <p className="text-muted-foreground text-sm">No entries yet this month.</p>
        <p className="text-xs text-muted-foreground">Add your first meal to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {(entries as EntryCardProps[]).map((entry) => (
        <EntryCard key={entry.id} {...entry} />
      ))}
    </div>
  );
};

type EntryCardProps = {
  id: number;
  title: string;
  calories: number;
  eaten_at: string;
  description?: string;
  image_url?: string | null;
  ingredients: Array<{ id: number; name: string; weight_grams?: string | null }>;
};
