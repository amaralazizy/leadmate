import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

// Card skeleton for dashboard cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 border rounded-lg", className)}>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

// Chat list item skeleton
export function ChatListSkeleton() {
  return (
    <div className="border-b p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

// Message skeleton for chat interface
export function MessageSkeleton({ isOwn = false }: { isOwn?: boolean }) {
  return (
    <div
      className={cn("flex gap-3 mb-4", isOwn ? "justify-end" : "justify-start")}
    >
      {!isOwn && <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />}
      <div
        className={cn(
          "max-w-[75%] space-y-1",
          isOwn ? "items-end" : "items-start"
        )}
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className={cn("h-16 rounded-2xl", isOwn ? "w-40" : "w-48")} />
      </div>
      {isOwn && <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />}
    </div>
  );
}

// Settings form skeleton
export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

// Table skeleton for billing/usage data
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b bg-muted/50 p-4">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b last:border-b-0 p-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Knowledge base skeleton
export function KnowledgeItemSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-6 w-6" />
      </div>
      <Skeleton className="h-16 w-full" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
