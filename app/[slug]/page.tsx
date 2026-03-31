"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERNAL__useGetMonthlyDashboard } from "@/features/dashboard/api_hooks/INTERNAL__useGetMonthlyDashboard";
import { DashboardSummary } from "@/features/dashboard/dashboard-summary/DashboardSummary.component";
import { MonthNavigation } from "@/features/dashboard/month-navigation/MonthNavigation.component";
import { MonthlyChart } from "@/features/dashboard/monthly-chart/MonthlyChart.component";
import { VoiceRecorder } from "@/features/voice-recorder/VoiceRecorder.component";
import type { MonthlyDashboard } from "@/features/dashboard/_dashboard.api";

export default function DashboardPage() {
  const { slug } = useParams<{ slug: string }>();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

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
      <div className="flex items-center justify-between gap-3">
        <MonthNavigation
          year={year}
          month={month}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-2 shrink-0"
          onClick={() => setIsVoiceOpen(true)}
        >
          <Mic className="h-4 w-4" />
          Voice
        </Button>
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
      <VoiceRecorder open={isVoiceOpen} onOpenChange={setIsVoiceOpen} />
    </div>
  );
}
