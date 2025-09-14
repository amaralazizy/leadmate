"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
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
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
  archived: {
    label: "Archived",
    color: "hsl(var(--chart-3))",
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

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <p className="text-sm text-muted-foreground">
          Conversation status distribution over time
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            fontSize={12}
          />
          <YAxis fontSize={12} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="active"
            stackId="1"
            fill="var(--color-active)"
            stroke="var(--color-active)"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stackId="1"
            fill="var(--color-completed)"
            stroke="var(--color-completed)"
            fillOpacity={0.8}
          />
          <Area
            type="monotone"
            dataKey="archived"
            stackId="1"
            fill="var(--color-archived)"
            stroke="var(--color-archived)"
            fillOpacity={0.8}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
