import Link from "next/link";
import { getChats } from "@/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/index";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  timestamp: string;
  customer_phone: string;
  status: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "archived":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <MessageCircle className="w-3 h-3" />;
    case "completed":
      return <CheckCircle className="w-3 h-3" />;
    case "archived":
      return <Clock className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

const formatTime = (timestamp: string) => {
  try {
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    // For older messages, show the actual date
    return messageTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "unknown";
  }
};

const isRecentlyActive = (timestamp: string) => {
  try {
    const messageTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const oneMinuteAgo = now - 1 * 60 * 1000; // 1 minute in milliseconds
    return messageTime > oneMinuteAgo;
  } catch {
    return false;
  }
};

export default async function ChatsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const chats: Chat[] = await getChats(user.id);

  return (
    <section className="p-4 md:p-6 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading text-foreground">Chats</h1>
          <p className="text-sm text-foreground/60 mt-1">
            {chats.length} conversation{chats.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Chats List */}
      <div className="space-y-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-secondary-background border-2 border-dashed border-border flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/80 mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-foreground/60 text-center max-w-sm mb-6">
              Your customer conversations will appear here. Start engaging with
              your customers through WhatsApp.
            </p>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Start First Conversation
            </Button>
          </div>
        ) : (
          chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/dashboard/chats/${chat.id}`}
              className={cn(
                "block p-4 rounded-2xl border border-border bg-secondary-background/50",
                "hover:bg-secondary-background hover:shadow-md hover:border-border/80",
                "transition-all duration-200 group"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12 border-2 border-border shadow-sm">
                    <AvatarFallback className="bg-main/10 text-main font-semibold">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>

                  {/* Online status indicator */}
                  {isRecentlyActive(chat.timestamp) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-secondary-background shadow-sm" />
                  )}
                </div>

                {/* Chat info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate">
                        {chat.name}
                      </h3>
                      {isRecentlyActive(chat.timestamp) && (
                        <Badge
                          variant="default"
                          className={cn(
                            "text-xs px-2 py-0.5 gap-1",
                            getStatusColor(chat.status)
                          )}
                        >
                          {getStatusIcon(chat.status)}
                          {chat.status}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-foreground/50 flex-shrink-0">
                      {formatTime(chat.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/70 truncate group-hover:text-foreground/90 transition-colors">
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Unread indicator - Only show if recently active */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {isRecentlyActive(chat.timestamp) && (
                    <div className="w-2 h-2 bg-main rounded-full shadow-sm" />
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
