import {
  CardSkeleton,
  TableSkeleton,
} from "@/components/ui/skeleton-components";
import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Billing Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Current Plan */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="border rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <TableSkeleton rows={6} />
      </div>
    </div>
  );
}
