"use client";

import { cn } from "@/lib/utils";
import type { MealPlanEntry } from "../_meal-plan.queries";
import { MealChip } from "../meal-chip/MealChip.component";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type DayColumnProps = {
  date: Date;
  meals: MealPlanEntry[];
  isToday: boolean;
  isSelected: boolean;
  selectionMode: boolean;
  onToggleSelect: () => void;
  onAddMeal: () => void;
  onDeleteMeal: (id: number) => void;
  onMealChipClick: (meal: MealPlanEntry) => void;
  isDeletingId?: number | null;
};

export const DayColumn = ({
  date,
  meals,
  isToday,
  isSelected,
  selectionMode,
  onToggleSelect,
  onAddMeal,
  onDeleteMeal,
  onMealChipClick,
  isDeletingId,
}: DayColumnProps) => {
  const dayName = DAY_NAMES[date.getDay() === 0 ? 6 : date.getDay() - 1];
  const dayNum = date.getDate();

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border p-2.5 min-h-[120px] transition-all",
        isToday && "border-primary/50 bg-primary/5",
        isSelected && "ring-2 ring-primary",
        selectionMode && "cursor-pointer"
      )}
      onClick={selectionMode ? onToggleSelect : undefined}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          {selectionMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onToggleSelect}
              onClick={(e) => e.stopPropagation()}
              className="h-3.5 w-3.5 rounded accent-primary"
            />
          )}
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              isToday ? "text-primary" : "text-muted-foreground"
            )}
          >
            {dayName}
          </span>
          <span className={cn("text-xs font-medium", isToday && "text-primary")}>{dayNum}</span>
        </div>
        {!selectionMode && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddMeal();
            }}
            className="text-muted-foreground hover:text-foreground transition-colors text-base leading-none"
            aria-label="Add meal"
          >
            +
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {meals.length === 0 ? (
          <p className="text-xs text-muted-foreground/60 italic">No meals</p>
        ) : (
          meals.map((meal) => (
            <MealChip
              key={meal.id}
              id={meal.id}
              name={meal.predefined_meal_name}
              calories={meal.predefined_meal_calories}
              onClick={() => onMealChipClick(meal)}
              onDelete={() => onDeleteMeal(meal.id)}
              isDeleting={isDeletingId === meal.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
