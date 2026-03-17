"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddEntryForm } from "@/features/entries/add-entry-form/AddEntryForm.component";
import { EntriesList } from "@/features/entries/entries-list/EntriesList.component";
import { QuickAddMealPicker } from "@/features/meals/quick-add-meal-picker/QuickAddMealPicker.component";

export default function EntriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold capitalize">{slug}&apos;s entries</h2>
        <p className="text-sm text-muted-foreground mt-1">View and manage your meal entries</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setIsQuickAddOpen(true)}
          className="group flex items-center gap-4 rounded-xl border-2 border-dashed border-border p-5 hover:border-primary hover:bg-primary/5 transition-all text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <Zap className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="font-semibold text-sm">Quick Add</p>
            <p className="text-xs text-muted-foreground mt-0.5">Add from predefined meals instantly</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="group flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-all text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Add Entry</p>
            <p className="text-xs text-primary-foreground/70 mt-0.5">Record a new meal or snack</p>
          </div>
        </button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="sm:max-w-lg max-sm:fixed max-sm:inset-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:h-dvh max-sm:rounded-none max-sm:border-0 flex flex-col p-0 gap-0 overflow-hidden"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
            <DialogTitle>Add Entry</DialogTitle>
            <DialogDescription>Record a new meal or snack</DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4">
            <AddEntryForm
              person_type={slug as "filip" | "klara"}
              defaultDate={new Date()}
              onSuccess={handleSuccess}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <h3 className="text-base font-semibold mb-4">Previous Entries</h3>
        <EntriesList person_type={slug} />
      </div>

      <QuickAddMealPicker
        person_type={slug as "filip" | "klara"}
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      />
    </div>
  );
}
