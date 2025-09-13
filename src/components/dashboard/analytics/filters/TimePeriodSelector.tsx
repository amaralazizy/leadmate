"use client";

import { Button } from "@/components/ui/button";
import type { TimePeriod } from "@/lib/schemas";

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const PERIOD_OPTIONS: {
  value: TimePeriod;
  label: string;
  description: string;
}[] = [
  { value: "day", label: "Today", description: "Hourly breakdown" },
  { value: "month", label: "This Month", description: "Daily breakdown" },
  { value: "year", label: "This Year", description: "Monthly breakdown" },
];

export default function TimePeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: TimePeriodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Period:</span>
      <div className="flex rounded-lg border bg-background p-1">
        {PERIOD_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={selectedPeriod === option.value ? "default" : "neutral"}
            size="sm"
            className="px-3 py-1 text-xs"
            onClick={() => onPeriodChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
