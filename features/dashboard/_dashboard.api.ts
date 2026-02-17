import { INTERNAL__useGetMonthlyDashboard } from "./api_hooks/INTERNAL__useGetMonthlyDashboard";

export type DailyCalorieSummary = {
  date: string;
  total_calories: number;
  entry_count: number;
};

export type MonthlyDashboard = {
  person_type: string;
  year: number;
  month: number;
  daily_goal: number;
  monthly_goal: number;
  total_calories: number;
  daily_summaries: DailyCalorieSummary[];
  avg_calories_this_week: number;
  avg_calories_this_month: number;
  avg_calories_this_year: number;
};

export const dashboardApi = {
  useGetMonthlyDashboard: INTERNAL__useGetMonthlyDashboard,
};
