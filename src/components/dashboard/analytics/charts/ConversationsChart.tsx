"use client";

import { AreaChart, Area, XAxis, YAxis, Legend, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ConversationsChartData, TimePeriod } from "@/lib/schemas";

interface ConversationsChartProps {
  data: ConversationsChartData[];
  period: TimePeriod;
}

const chartConfig = {
  active: {
    label: "Active",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
  archived: {
    label: "Archived",
    color: "var(--chart-3)",
  },
};

export default function ConversationsChart({
  data,
  period,
}: ConversationsChartProps) {
  const formatXAxisLabel = (value: string) => {
    switch (period) {
      case "day":
        return value; // Already formatted as "HH:00"
      case "month":
        return new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      case "year":
        return new Date(value + "-01").toLocaleDateString("en-US", {
          month: "short",
        });
      default:
        return value;
    }
  };

  const getTitle = () => {
    switch (period) {
      case "day":
        return "Today's Conversations";
      case "month":
        return "This Month's Conversations";
      case "year":
        return "This Year's Conversations";
      default:
        return "Conversation Activity";
    }
  };

  // Check if data is empty or all values are zero
  const hasData =
    data &&
    data.length > 0 &&
    data.some(
      (item) => item.active > 0 || item.completed > 0 || item.archived > 0
    );

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <p className="text-sm text-muted-foreground">
          Conversation status distribution over time
        </p>
      </div>

      {!hasData ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <h4 className="text-lg font-medium text-muted-foreground mb-2">
              No Conversations Yet
            </h4>
            <p className="text-sm text-muted-foreground">
              {period === "day"
                ? "No conversations today"
                : period === "month"
                ? "No conversations this month"
                : "No conversations this year"}
            </p>
          </div>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              fontSize={12}
              tickMargin={10}
              strokeOpacity={0}
              type="category"
            />
            <YAxis
              fontSize={12}
              tickMargin={10}
              strokeOpacity={0}
              domain={[0, "dataMax + 1"]}
              minTickGap={5}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="active"
              stackId="1"
              fill="var(--color-active)"
              stroke="var(--color-active)"
              strokeWidth={data.length <= 12 ? 2 : 1}
              fillOpacity={data.length <= 12 ? 0.7 : 0.5}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stackId="1"
              fill="var(--color-completed)"
              stroke="var(--color-completed)"
              strokeWidth={data.length <= 12 ? 2 : 1}
              fillOpacity={data.length <= 12 ? 0.7 : 0.5}
            />
            <Area
              type="monotone"
              dataKey="archived"
              stackId="1"
              fill="var(--color-archived)"
              stroke="var(--color-archived)"
              strokeWidth={data.length <= 12 ? 2 : 1}
              fillOpacity={data.length <= 12 ? 0.7 : 0.5}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </Card>
  );
}
