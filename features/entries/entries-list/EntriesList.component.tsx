"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEntryForm } from "../add-entry-form/AddEntryForm.component";
import type { EntryInitialValues } from "../add-entry-form/AddEntryForm.component";
import { INTERNAL__useGetAllEntries } from "../api_hooks/INTERNAL__useGetAllEntries";
import { EntryCard } from "../entry-card/EntryCard.component";

type EntriesListProps = {
  person_type: string;
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

function getDateKey(eatenAt: string): string {
  return eatenAt.slice(0, 10);
}

function formatDayLabel(dateKey: string, todayKey: string): string {
  if (dateKey === todayKey) return "Today";
  const d = new Date(dateKey + "T12:00:00");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  if (dateKey === yesterdayKey) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export const EntriesList = ({ person_type }: EntriesListProps) => {
  const [entryToEdit, setEntryToEdit] = useState<EntryCardProps | null>(null);

  const { data: entries, isLoading, isError } = INTERNAL__useGetAllEntries(person_type);

  const groupedByDay = useMemo(() => {
    if (!entries || (entries as EntryCardProps[]).length === 0) return [];
    const list = entries as EntryCardProps[];
    const map = new Map<string, EntryCardProps[]>();
    for (const entry of list) {
      const key = getDateKey(entry.eaten_at);
      const group = map.get(key) ?? [];
      group.push(entry);
      map.set(key, group);
    }
    const todayKey = new Date().toISOString().slice(0, 10);
    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([dateKey, dayEntries]) => ({
        dateKey,
        label: formatDayLabel(dateKey, todayKey),
        entries: dayEntries,
      }));
  }, [entries]);

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

  if (groupedByDay.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
        <p className="text-muted-foreground text-sm">No entries yet.</p>
        <p className="text-xs text-muted-foreground">Add your first meal to get started.</p>
      </div>
    );
  }

  const initialValuesForEdit: EntryInitialValues | undefined = entryToEdit
    ? {
        title: entryToEdit.title,
        description: entryToEdit.description,
        calories: entryToEdit.calories,
        eaten_at: entryToEdit.eaten_at,
        ingredients: entryToEdit.ingredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          weight_grams: ing.weight_grams,
        })),
      }
    : undefined;

  return (
    <>
      <div className="flex flex-col gap-6">
        {groupedByDay.map(({ dateKey, label, entries: dayEntries }) => (
          <div key={dateKey} className="flex flex-col gap-3">
            <h3 className="text-sm font-medium text-muted-foreground sticky top-14 bg-background/95 backdrop-blur py-1 -mx-1 px-1">
              {label}
            </h3>
            <div className="flex flex-col gap-3">
              {dayEntries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  {...entry}
                  onEdit={(e) => setEntryToEdit(e)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!entryToEdit} onOpenChange={(open) => !open && setEntryToEdit(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
            <DialogDescription>
              Update the meal or snack details
            </DialogDescription>
          </DialogHeader>
          {entryToEdit && initialValuesForEdit && (
            <AddEntryForm
              person_type={person_type as "filip" | "klara"}
              entryId={entryToEdit.id}
              initialValues={initialValuesForEdit}
              onSuccess={() => setEntryToEdit(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
