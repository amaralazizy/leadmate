"use client";

import { XAxis, YAxis, AreaChart, Area, Legend, CartesianGrid } from "recharts";
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
    color: "var(--chart-1)",
  },
  bot: {
    label: "Bot Messages",
    color: "var(--chart-2)",
  },
  total: {
    label: "Total Messages",
    color: "var(--chart-3)",
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

  // Check if data is empty or all values are zero
  const hasData =
    data &&
    data.length > 0 &&
    data.some((item) => item.customer > 0 || item.bot > 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <p className="text-sm text-muted-foreground">
          Messages exchanged between customers and your AI bot
        </p>
      </div>

      {!hasData ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h4 className="text-lg font-medium text-muted-foreground mb-2">
              No Messages Yet
            </h4>
            <p className="text-sm text-muted-foreground">
              {period === "day"
                ? "No messages exchanged today"
                : period === "month"
                ? "No messages this month"
                : "No messages this year"}
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
              domain={[0, "dataMax + 2"]}
              minTickGap={5}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ bottom: -10 }} />
            <Area
              type="monotone"
              dataKey="customer"
              fill="var(--color-customer)"
              stroke="var(--color-customer)"
              strokeWidth={data.length <= 12 ? 3 : 2}
              fillOpacity={data.length <= 12 ? 0.6 : 0.4}
              dot={data.length <= 12 ? { r: 4, strokeWidth: 2 } : false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="bot"
              fill="var(--color-bot)"
              stroke="var(--color-bot)"
              strokeWidth={data.length <= 12 ? 3 : 2}
              fillOpacity={data.length <= 12 ? 0.6 : 0.4}
              dot={data.length <= 12 ? { r: 4, strokeWidth: 2 } : false}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </Card>
  );
}
