"use client";

import {
  LineChart,
  Line,
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
import type { MessagesChartData, TimePeriod } from "@/lib/schemas";

interface MessagesChartProps {
  data: MessagesChartData[];
  period: TimePeriod;
}

const chartConfig = {
  customer: {
    label: "Customer Messages",
    color: "hsl(var(--chart-1))",
  },
  bot: {
    label: "Bot Messages",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "Total Messages",
    color: "hsl(var(--chart-3))",
  },
};

export default function MessagesChart({ data, period }: MessagesChartProps) {
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
        return "Today's Message Activity";
      case "month":
        return "This Month's Messages";
      case "year":
        return "This Year's Messages";
      default:
        return "Message Activity";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <p className="text-sm text-muted-foreground">
          Messages exchanged between customers and your AI bot
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <LineChart
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
          <Line
            type="monotone"
            dataKey="customer"
            stroke="var(--color-customer)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="bot"
            stroke="var(--color-bot)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </Card>
  );
}
