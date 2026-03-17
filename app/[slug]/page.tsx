"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INTERNAL__useGetMonthlyDashboard } from "@/features/dashboard/api_hooks/INTERNAL__useGetMonthlyDashboard";
import { DashboardSummary } from "@/features/dashboard/dashboard-summary/DashboardSummary.component";
import { MonthNavigation } from "@/features/dashboard/month-navigation/MonthNavigation.component";
import { MonthlyChart } from "@/features/dashboard/monthly-chart/MonthlyChart.component";
import { AddEntryForm } from "@/features/entries/add-entry-form/AddEntryForm.component";
import { QuickAddMealPicker } from "@/features/meals/quick-add-meal-picker/QuickAddMealPicker.component";
import type { MonthlyDashboard } from "@/features/dashboard/_dashboard.api";

export default function DashboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const { data, isLoading, isError } = INTERNAL__useGetMonthlyDashboard({
    person_type: slug,
    year,
    month,
  });

  const handlePrev = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <div className="flex items-center justify-between gap-2">
        <MonthNavigation
          year={year}
          month={month}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" variant="outline" onClick={() => setIsQuickAddOpen(true)}>
            <Zap className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Quick Add</span>
          </Button>
          <Button size="sm" onClick={() => setIsAddEntryOpen(true)}>
            <Plus className="h-3.5 w-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Add Entry</span>
          </Button>
        </div>
      </div>
      {isLoading && (
        <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">
          Loading dashboard…
        </div>
      )}
      {isError && (
        <div className="h-64 flex items-center justify-center text-sm text-destructive">
          Failed to load dashboard data.
        </div>
      )}
      {data != null && (
        <>
          <MonthlyChart
            data={data as MonthlyDashboard}
            year={year}
            month={month}
          />
          <DashboardSummary data={data as MonthlyDashboard} />
        </>
      )}
      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
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
              defaultDate={today}
              onSuccess={() => setIsAddEntryOpen(false)}
              onCancel={() => setIsAddEntryOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
      <QuickAddMealPicker
        person_type={slug as "filip" | "klara"}
        open={isQuickAddOpen}
        onOpenChange={setIsQuickAddOpen}
      />
    </div>
  );
}
