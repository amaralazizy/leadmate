"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
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
    color: "var(--chart-1)",
  },
  booking: {
    label: "Bookings",
    color: "var(--chart-2)",
  },
  inquiry: {
    label: "Inquiries",
    color: "var(--chart-3)",
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

  // Check if data is empty or all values are zero
  const hasData =
    data &&
    data.length > 0 &&
    data.some((item) => item.order > 0 || item.booking > 0 || item.inquiry > 0);

  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold">{getTitle()}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Leads captured by type over time
        </p>
      </div>

      {!hasData ? (
        <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
            <h4 className="text-base sm:text-lg font-medium text-muted-foreground mb-1 sm:mb-2">
              No Leads Yet
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {period === "day"
                ? "No leads generated today"
                : period === "month"
                ? "No leads this month"
                : "No leads this year"}
            </p>
          </div>
        </div>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="h-[200px] sm:h-[250px] lg:h-[300px]"
        >
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barCategoryGap={data.length <= 12 ? "20%" : "10%"}
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
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "none" }}
            />
            <Legend />
            <Bar
              dataKey="order"
              fill="var(--color-order)"
              radius={[2, 2, 0, 0]}
              minPointSize={2}
            />
            <Bar
              dataKey="booking"
              fill="var(--color-booking)"
              radius={[2, 2, 0, 0]}
              minPointSize={2}
            />
            <Bar
              dataKey="inquiry"
              fill="var(--color-inquiry)"
              radius={[2, 2, 0, 0]}
              minPointSize={2}
            />
          </BarChart>
        </ChartContainer>
      )}
    </Card>
  );
}
