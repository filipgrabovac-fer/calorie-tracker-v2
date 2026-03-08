"use client";

import { Badge } from "@/components/ui/badge";

type MealChipProps = {
  id: number;
  name: string;
  calories: number;
  onClick: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
};

export const MealChip = ({ name, calories, onClick, onDelete, isDeleting }: MealChipProps) => {
  return (
    <div
      className="flex items-center justify-between gap-1 px-2 py-1.5 rounded-md border bg-card hover:bg-muted/50 transition-colors cursor-pointer text-left"
      onClick={onClick}
    >
      <span className="text-xs font-medium truncate flex-1">{name}</span>
      <Badge variant="secondary" className="shrink-0 text-xs">
        {calories} kcal
      </Badge>
      <button
        type="button"
        disabled={isDeleting}
        className="ml-1 shrink-0 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Remove meal"
      >
        ×
      </button>
    </div>
  );
};
