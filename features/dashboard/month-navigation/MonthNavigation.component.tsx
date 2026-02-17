"use client";

import { Button } from "@/components/ui/button";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type MonthNavigationProps = {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
};

export const MonthNavigation = ({
  year,
  month,
  onPrev,
  onNext,
}: MonthNavigationProps) => {
  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <Button variant="outline" size="sm" onClick={onPrev} className="shrink-0">
        ←
      </Button>
      <div className="flex-1 text-center">
        <span className="font-semibold text-base sm:text-lg">
          {MONTHS[month - 1]} {year}
        </span>
        {isCurrentMonth && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            (this month)
          </span>
        )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={isCurrentMonth}
        className="shrink-0"
      >
        →
      </Button>
    </div>
  );
};
