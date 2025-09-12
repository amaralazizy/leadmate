import { SettingsFormSkeleton } from "@/components/ui/skeleton-components";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Settings Tabs */}
      <div className="mb-6">
        <div className="flex gap-6 border-b">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Settings Form */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <SettingsFormSkeleton />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="h-6 w-36 mb-4" />
            <div className="space-y-4">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
                <Skeleton className="h-3 w-52" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
