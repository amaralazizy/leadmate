import { Badge } from "@/components/ui/badge";

export default function WaitlistBadge() {
  return (
    <Badge className="px-4 py-2 rounded-full shadow-shadow transition-all animate-pulse">
      <span className="text-sm font-bold text-black ">Coming Soon</span>
    </Badge>
  );
}
