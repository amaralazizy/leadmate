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
    <section className="space-y-6">
      {/* Header with Time Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track your WhatsApp bot performance and customer engagement
          </p>
        </div>
        <TimePeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
        />
      </div>

      {/* Charts Grid */}
      {loading ? (
        <AnalyticsSkeleton />
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessagesChart data={data.messages} period={selectedPeriod} />
          <LeadsChart data={data.leads} period={selectedPeriod} />
          <div className="lg:col-span-2">
            <ConversationsChart
              data={data.conversations}
              period={selectedPeriod}
            />
          </div>
        </div>
      ) : (
        <Card className="p-6">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </Card>
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </Card>
      <div className="lg:col-span-2">
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </Card>
      </div>
    </div>
  );
}
