"use client";

import {
  BarChart,
  Bar,
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
import type { LeadsChartData, TimePeriod } from "@/lib/schemas";

interface LeadsChartProps {
  data: LeadsChartData[];
  period: TimePeriod;
}

const chartConfig = {
  order: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
  booking: {
    label: "Bookings",
    color: "hsl(var(--chart-2))",
  },
  inquiry: {
    label: "Inquiries",
    color: "hsl(var(--chart-3))",
  },
};

export default function LeadsChart({ data, period }: LeadsChartProps) {
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
        return "Today's Lead Generation";
      case "month":
        return "This Month's Leads";
      case "year":
        return "This Year's Leads";
      default:
        return "Lead Generation";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{getTitle()}</h3>
        <p className="text-sm text-muted-foreground">
          Leads captured by type over time
        </p>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px]">
        <BarChart
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
          <Bar
            dataKey="order"
            fill="var(--color-order)"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="booking"
            fill="var(--color-booking)"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="inquiry"
            fill="var(--color-inquiry)"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Card>
  );
}
