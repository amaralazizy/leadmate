"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TimePeriodSelector from "./filters/TimePeriodSelector";
import MessagesChart from "./charts/MessagesChart";
import LeadsChart from "./charts/LeadsChart";
import ConversationsChart from "./charts/ConversationsChart";
import type { TimePeriod, AnalyticsData } from "@/lib/schemas";

interface AnalyticsContainerProps {
  initialData?: AnalyticsData;
}

export default function AnalyticsContainer({
  initialData,
}: AnalyticsContainerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");
  const [data, setData] = useState<AnalyticsData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async (period: TimePeriod) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialData) {
      fetchAnalyticsData(selectedPeriod);
    }
  }, [selectedPeriod, initialData]);

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    if (!initialData) {
      fetchAnalyticsData(period);
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load analytics data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <section className="space-y-4 sm:space-y-6">
      {/* Header with Time Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Analytics Dashboard
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track your WhatsApp bot performance and customer engagement
          </p>
        </div>
        <div className="flex-shrink-0">
          <TimePeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
      </div>

      {/* Charts Grid */}
      {loading ? (
        <AnalyticsSkeleton />
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="w-full">
            <MessagesChart data={data.messages} period={selectedPeriod} />
          </div>
          <div className="w-full">
            <LeadsChart data={data.leads} period={selectedPeriod} />
          </div>
          <div className="lg:col-span-2 w-full">
            <ConversationsChart
              data={data.conversations}
              period={selectedPeriod}
            />
          </div>
        </div>
      ) : (
        <Card className="p-4 sm:p-6">
          <p className="text-center text-muted-foreground">
            No analytics data available
          </p>
        </Card>
      )}
    </section>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card className="p-4 sm:p-6">
        <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-2" />
        <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mb-4" />
        <Skeleton className="h-[200px] sm:h-[250px] lg:h-[300px] w-full" />
      </Card>
      <Card className="p-4 sm:p-6">
        <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-2" />
        <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mb-4" />
        <Skeleton className="h-[200px] sm:h-[250px] lg:h-[300px] w-full" />
      </Card>
      <div className="lg:col-span-2">
        <Card className="p-4 sm:p-6">
          <Skeleton className="h-5 sm:h-6 w-32 sm:w-48 mb-2" />
          <Skeleton className="h-3 sm:h-4 w-48 sm:w-64 mb-4" />
          <Skeleton className="h-[200px] sm:h-[250px] lg:h-[300px] w-full" />
        </Card>
      </div>
    </div>
  );
}
