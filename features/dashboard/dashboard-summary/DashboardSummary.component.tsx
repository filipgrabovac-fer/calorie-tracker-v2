"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { MonthlyDashboard } from "../_dashboard.api";

type DashboardSummaryProps = {
  data: MonthlyDashboard;
};

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">{label}</p>
      <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
    </CardContent>
  </Card>
);

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const DashboardSummary = ({ data }: DashboardSummaryProps) => {
  const {
    total_calories,
    monthly_goal,
    daily_goal,
    daily_summaries,
    avg_calories_this_week,
    avg_calories_this_month,
    avg_calories_this_year,
  } = data;

  const todayKey = getTodayKey();
  const isViewingCurrentMonth =
    data.year === new Date().getFullYear() &&
    data.month === new Date().getMonth() + 1;
  const todaySummary = isViewingCurrentMonth
    ? daily_summaries.find((s) => s.date.slice(0, 10) === todayKey)
    : undefined;
  const todayCalories = todaySummary?.total_calories ?? 0;

  const dailyGoalValue = isViewingCurrentMonth
    ? `${todayCalories.toLocaleString()}/${daily_goal.toLocaleString()} kcal`
    : `${daily_goal.toLocaleString()} kcal`;

  const progress =
    monthly_goal > 0
      ? Math.min(Math.round((total_calories / monthly_goal) * 100), 100)
      : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <StatCard
          label="Month total"
          value={`${total_calories.toLocaleString()} kcal`}
          sub={`${progress}% of ${monthly_goal.toLocaleString()} goal`}
        />
        <StatCard
          label="Daily goal"
          value={dailyGoalValue}
          sub={isViewingCurrentMonth ? "today" : undefined}
        />
        <StatCard
          label="Avg this week"
          value={`${avg_calories_this_week.toLocaleString()} kcal`}
          sub="Mon–Sun"
        />
        <StatCard
          label="Avg this month"
          value={`${avg_calories_this_month.toLocaleString()} kcal`}
          sub="days with entries"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          label="Avg this year"
          value={`${avg_calories_this_year.toLocaleString()} kcal`}
          sub="per day with entries"
        />
        <StatCard
          label="Monthly goal"
          value={`${monthly_goal.toLocaleString()} kcal`}
          sub={`${daily_goal.toLocaleString()} × days in month`}
        />
      </div>
    </div>
  );
};
