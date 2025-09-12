import { ChatListSkeleton } from "@/components/ui/skeleton-components";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatsLoading() {
  return (
    <section className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 space-y-2">
        <Skeleton className="h-6 w-16 animate-pulse" />
        <Skeleton className="h-4 w-48 animate-pulse" />
      </div>

      {/* Search/Filter */}
      <div className="mb-4 flex gap-3">
        <Skeleton className="h-10 flex-1 animate-pulse" />
        <Skeleton className="h-10 w-24 animate-pulse" />
      </div>

      {/* Chat List */}
      <div className="rounded-base border divide-y">
        {Array.from({ length: 8 }).map((_, i) => (
          <ChatListSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}
