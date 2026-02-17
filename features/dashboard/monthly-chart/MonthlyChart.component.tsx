"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import type { MonthlyDashboard } from "../_dashboard.api";

type MonthlyChartProps = {
  data: MonthlyDashboard;
  year: number;
  month: number;
};

export const MonthlyChart = ({ data, year, month }: MonthlyChartProps) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const summary = data.daily_summaries.find(
      (s) => new Date(s.date).getDate() === day
    );
    return {
      day,
      calories: summary?.total_calories ?? 0,
    };
  });

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="w-full h-56 sm:h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false}
                axisLine={false}
                width={35}
              />
              <Tooltip
                formatter={(value) => [`${value ?? 0} kcal`, "Calories"]}
                labelFormatter={(label) => `Day ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                }}
              />
              <ReferenceLine
                y={data.daily_goal}
                stroke="hsl(var(--destructive))"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Goal: ${data.daily_goal}`,
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "hsl(var(--destructive))",
                }}
              />
              <Bar
                dataKey="calories"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
