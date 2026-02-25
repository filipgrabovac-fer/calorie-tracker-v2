"use client";

import { useEffect, useState } from "react";
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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export const MonthlyChart = ({ data, year, month }: MonthlyChartProps) => {
  const isMobile = useIsMobile();
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

  const tickFontSize = isMobile ? 11 : 10;
  const chartMinWidth = isMobile ? 320 : undefined;

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="w-full overflow-x-auto">
          <div
            className="h-64 sm:h-64 md:h-80"
            style={chartMinWidth ? { minWidth: chartMinWidth } : undefined}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: tickFontSize, fill: "hsl(var(--muted-foreground))" }}
                  tickLine={false}
                  axisLine={false}
                  interval={isMobile ? 4 : 0}
                />
                <YAxis
                  tick={{ fontSize: tickFontSize, fill: "hsl(var(--muted-foreground))" }}
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
                    position: isMobile ? "insideTopLeft" : "insideTopRight",
                    fontSize: tickFontSize,
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
        </div>
      </CardContent>
    </Card>
  );
};
