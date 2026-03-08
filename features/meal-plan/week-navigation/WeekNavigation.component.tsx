"use client";

import { Button } from "@/components/ui/button";

type WeekNavigationProps = {
  weekStart: Date;
  onPrev: () => void;
  onNext: () => void;
};

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export const WeekNavigation = ({ weekStart, onPrev, onNext }: WeekNavigationProps) => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const currentWeekStart = getWeekStart(new Date());
  const isCurrentWeek = weekStart.toDateString() === currentWeekStart.toDateString();

  const label = `${formatDate(weekStart)} – ${formatDate(weekEnd)}, ${weekEnd.getFullYear()}`;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" size="sm" onClick={onPrev} className="shrink-0">
        ←
      </Button>
      <div className="flex-1 text-center">
        <span className="font-semibold text-base sm:text-lg">{label}</span>
        {isCurrentWeek && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">(this week)</span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isCurrentWeek}
        className="shrink-0"
      >
        →
      </Button>
    </div>
  );
};
