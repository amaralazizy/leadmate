import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/index";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  User,
  Clock,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

type Props = {
  conversationId: string;
  customerPhone: string;
  status?: string;
  customerName?: string;
  lastSeen?: string;
  lastMessageTimestamp?: string;
};

const getStatusInfo = (status: string = "active") => {
  switch (status) {
    case "active":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <MessageCircle className="w-3 h-3" />,
        label: "Active",
      };
    case "completed":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Completed",
      };
    case "archived":
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Clock className="w-3 h-3" />,
        label: "Archived",
      };
    default:
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <MessageCircle className="w-3 h-3" />,
        label: "Active",
      };
  }
};

const isRecentlyActive = (timestamp?: string) => {
  if (!timestamp) return false;
  const messageTime = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const oneMinuteAgo = now - 1 * 60 * 1000; // 1 minute in milliseconds
  return messageTime > oneMinuteAgo;
};

export default function ChatHeader({
  conversationId,
  customerPhone,
  status = "active",
  customerName,
  lastSeen,
  lastMessageTimestamp,
}: Props) {
  const statusInfo = getStatusInfo(status);
  const displayName = customerName || customerPhone;
  const showOnlineStatus = isRecentlyActive(lastMessageTimestamp);

  return (
    <header className="border-b border-border bg-secondary-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4">
        {/* Left section - Back button and customer info */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/chats">
            <Button variant="default" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            {/* Customer Avatar */}
            <div className="relative">
              <Avatar className="w-10 h-10 border-2 border-border shadow-sm">
                <AvatarFallback className="bg-main/10 text-main font-semibold text-sm">
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>

              {/* Online status indicator */}
              {showOnlineStatus && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary-background shadow-sm" />
              )}
            </div>

            {/* Customer info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-foreground">{displayName}</h1>
                {showOnlineStatus && (
                  <Badge
                    variant="default"
                    className={cn(
                      "text-xs px-2 py-0.5 gap-1 hidden sm:flex",
                      statusInfo.color
                    )}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-foreground/60">
                {lastSeen && <span>Last seen {lastSeen}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar for mobile */}
      {showOnlineStatus && (
        <div className="sm:hidden px-4 pb-3">
          <Badge
            variant="default"
            className={cn("text-xs px-2 py-1 gap-1", statusInfo.color)}
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
      )}
    </header>
  );
}
