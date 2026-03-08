"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { goalsApi } from "@/features/goals/_goals.api";
import { mealPlanApi } from "@/features/meal-plan/_meal-plan.api";
import type { MealPlanEntry } from "@/features/meal-plan/_meal-plan.queries";
import { WeekNavigation } from "@/features/meal-plan/week-navigation/WeekNavigation.component";
import { DayColumn } from "@/features/meal-plan/day-column/DayColumn.component";
import { MealPickerDialog } from "@/features/meal-plan/meal-picker-dialog/MealPickerDialog.component";
import { AddToLogDialog } from "@/features/meal-plan/add-to-log-dialog/AddToLogDialog.component";
import { BulkAssignDialog } from "@/features/meal-plan/bulk-assign-dialog/BulkAssignDialog.component";
import { MealPlanAutoAddChecker } from "@/features/meal-plan/auto-add-checker/MealPlanAutoAddChecker.component";

// ── date utils ────────────────────────────────────────────────
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── page ─────────────────────────────────────────────────────
export default function MealPlanPage() {
  const { slug } = useParams<{ slug: string }>();

  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set());
  const [addMealForDate, setAddMealForDate] = useState<Date | null>(null);
  const [addToLogTarget, setAddToLogTarget] = useState<{
    meal: MealPlanEntry;
    date: Date;
  } | null>(null);
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false);

  const weekStartStr = toDateString(weekStart);
  const weekDays = getWeekDays(weekStart);
  const todayStr = toDateString(new Date());

  const { data: plans, isLoading } = mealPlanApi.useGetWeekMealPlan({
    person_type: slug,
    week_start: weekStartStr,
  });

  const { data: goal } = goalsApi.useGetGoal(slug);
  const autoAddEnabled = (goal as any)?.auto_add_meal_plan ?? false;

  const { mutate: deleteMealPlan, isPending: isDeletePending, variables: deletingId } =
    mealPlanApi.useDeleteMealPlan();

  const { mutate: bulkDelete, isPending: isBulkDeletePending } =
    mealPlanApi.usePostBulkDeleteMealPlan(() => {
      setSelectedDays(new Set());
      setSelectionMode(false);
    });

  // Group plans by date string
  const plansByDate = useMemo(() => {
    const map = new Map<string, MealPlanEntry[]>();
    const allPlans = (plans as MealPlanEntry[] | undefined) ?? [];
    for (const plan of allPlans) {
      const existing = map.get(plan.date) ?? [];
      map.set(plan.date, [...existing, plan]);
    }
    return map;
  }, [plans]);

  // Exit selection mode on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectionMode) {
        setSelectionMode(false);
        setSelectedDays(new Set());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectionMode]);

  const toggleDay = (dateStr: string) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dateStr)) next.delete(dateStr);
      else next.add(dateStr);
      return next;
    });
  };

  const handlePrev = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNext = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleBulkClear = () => {
    const allPlans = (plans as MealPlanEntry[] | undefined) ?? [];
    const ids = allPlans
      .filter((p) => selectedDays.has(p.date))
      .map((p) => p.id);
    if (ids.length > 0) bulkDelete(ids);
  };

  const selectedCount = selectedDays.size;

  const dayColumns = weekDays.map((day) => {
    const dateStr = toDateString(day);
    const dayMeals = plansByDate.get(dateStr) ?? [];
    const isToday = dateStr === todayStr;
    const isSelected = selectedDays.has(dateStr);

    return (
      <DayColumn
        key={dateStr}
        date={day}
        meals={dayMeals}
        isToday={isToday}
        isSelected={isSelected}
        selectionMode={selectionMode}
        onToggleSelect={() => toggleDay(dateStr)}
        onAddMeal={() => setAddMealForDate(day)}
        onDeleteMeal={(id) => deleteMealPlan(id)}
        onMealChipClick={(meal) => setAddToLogTarget({ meal, date: day })}
        isDeletingId={isDeletePending ? (deletingId as number) : null}
      />
    );
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Meal Plan</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Assign predefined meals to days of the week.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {selectionMode ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedDays(new Set());
                }}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={selectedCount === 0 || isBulkDeletePending}
                onClick={handleBulkClear}
              >
                Clear ({selectedCount})
              </Button>
              <Button
                size="sm"
                disabled={selectedCount === 0}
                onClick={() => setBulkAssignOpen(true)}
              >
                Assign Meal ({selectedCount})
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setSelectionMode(true)}>
              Select
            </Button>
          )}
        </div>
      </div>

      <WeekNavigation weekStart={weekStart} onPrev={handlePrev} onNext={handleNext} />

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
      )}

      {!isLoading && (
        <>
          {/* Desktop: 7-column grid */}
          <div className="hidden sm:grid grid-cols-7 gap-2">{dayColumns}</div>
          {/* Mobile: vertical list */}
          <div className="flex flex-col sm:hidden gap-3">{dayColumns}</div>
        </>
      )}

      {/* Dialogs */}
      {addMealForDate && (
        <MealPickerDialog
          person_type={slug}
          date={addMealForDate}
          open={!!addMealForDate}
          onOpenChange={(open) => !open && setAddMealForDate(null)}
        />
      )}

      {addToLogTarget && (
        <AddToLogDialog
          mealName={addToLogTarget.meal.predefined_meal_name}
          mealCalories={addToLogTarget.meal.predefined_meal_calories}
          predefined_meal_id={addToLogTarget.meal.predefined_meal}
          person_type={slug}
          date={addToLogTarget.date}
          open={!!addToLogTarget}
          onOpenChange={(open) => !open && setAddToLogTarget(null)}
        />
      )}

      <BulkAssignDialog
        person_type={slug}
        selectedDates={Array.from(selectedDays)}
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
        onSuccess={() => {
          setSelectedDays(new Set());
          setSelectionMode(false);
        }}
      />

      <MealPlanAutoAddChecker person_type={slug} autoAddEnabled={autoAddEnabled} />
    </div>
  );
}
