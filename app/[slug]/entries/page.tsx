"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddEntryForm } from "@/features/entries/add-entry-form/AddEntryForm.component";
import { EntriesList } from "@/features/entries/entries-list/EntriesList.component";

export default function EntriesPage() {
  const { slug } = useParams<{ slug: string }>();
  const today = new Date();
  const [year] = useState(today.getFullYear());
  const [month] = useState(today.getMonth() + 1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold capitalize">{slug}&apos;s entries</h2>
          <p className="text-sm text-muted-foreground mt-1">View and manage your meal entries</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hidden sm:flex">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Entry</DialogTitle>
              <DialogDescription>
                Record a new meal or snack
              </DialogDescription>
            </DialogHeader>
            <AddEntryForm person_type={slug as "filip" | "klara"} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Card className="sm:hidden">
        <CardContent className="p-4 sm:p-6">
          <AddEntryForm person_type={slug as "filip" | "klara"} />
        </CardContent>
      </Card>
      <EntriesList person_type={slug} year={year} month={month} />
    </div>
  );
}
