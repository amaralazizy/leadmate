import { cn } from "@/lib/utils/index";
import type { ChatMessage } from "@/hooks/use-realtime-chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, User, Bot } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  showHeader: boolean;
  showAvatar?: boolean;
}

export const ChatMessageItem = ({
  message,
  isOwnMessage,
  showHeader,
  showAvatar = true,
}: ChatMessageItemProps) => {
  const formatTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDay = new Date(
      messageDate.getFullYear(),
      messageDate.getMonth(),
      messageDate.getDate()
    );

    const daysDiff = Math.floor(
      (today.getTime() - messageDay.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Today - show only time
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (daysDiff === 1) {
      // Yesterday
      return `Yesterday ${messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if (daysDiff < 7) {
      // This week - show day and time
      return messageDate.toLocaleDateString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      // Older - show date and time
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 group",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar for incoming messages */}
      {!isOwnMessage && showAvatar && (
        <div className={cn("flex-shrink-0", showHeader ? "mt-0" : "mt-8")}>
          {showHeader && (
            <Avatar className="w-8 h-8 border-2 border-border shadow-sm">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-medium">
                {message.sender === "customer" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      <div
        className={cn("max-w-[75%] flex flex-col", {
          "items-end": isOwnMessage,
          "items-start": !isOwnMessage,
        })}
      >
        {/* Sender name and timestamp */}
        {showHeader && (
          <div
            className={cn("flex items-center gap-2 mb-1", {
              "flex-row-reverse": isOwnMessage,
            })}
          >
            <span className="text-xs font-semibold text-foreground/80">
              {message.sender === "customer" ? "Customer" : "Assistant"}
            </span>
            <span className="text-xs text-foreground/50">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md",
            isOwnMessage
              ? "bg-main text-main-foreground rounded-br-md"
              : "bg-secondary-background border border-border rounded-bl-md"
          )}
        >
          {/* Message content */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Message time and status */}
          <div
            className={cn(
              "flex items-center justify-end gap-1 mt-2",
              isOwnMessage ? "text-main-foreground/60" : "text-foreground/50"
            )}
          ></div>
        </div>
      </div>

      {/* Avatar for outgoing messages */}
      {isOwnMessage && showAvatar && (
        <div className={cn("flex-shrink-0", showHeader ? "mt-0" : "mt-8")}>
          {showHeader && (
            <Avatar className="w-8 h-8 border-2 border-main shadow-sm">
              <AvatarFallback className="bg-main text-main-foreground text-xs font-medium">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </div>
  );
};
