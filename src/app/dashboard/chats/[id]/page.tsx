import { getMessagesByConversationId, getChatById } from "@/actions";
import { RealtimeChat } from "@/components/dashboard/chats/realtime-chat";
import ChatHeader from "@/components/dashboard/chats/ChatHeader";
import { createClient } from "@/lib/supabase/server";
import { getUserName } from "@/lib/utils/utils";
import { redirect } from "next/navigation";
import ChatPageClient from "./ChatPageClient";

type Params = { params: Promise<{ id: string }> };

const formatLastSeen = (timestamp: string) => {
  const messageTime = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - messageTime.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) {
    return "just now";
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays <= 6) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else if (diffDays < 30) {
    // 7+ days, show in weeks
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  } else {
    // More than 30 days, show the actual date
    return messageTime.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        messageTime.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

export default async function ChatDetailPage({ params }: Params) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  try {
    const [messages, conversation] = await Promise.all([
      getMessagesByConversationId(id),
      getChatById(id),
    ]);

    if (!conversation) {
      return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)] m-4 rounded-2xl border bg-secondary-background/30">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground/80 mb-2">
              Conversation not found
            </h2>
            <p className="text-sm text-foreground/60">
              This conversation may have been deleted or you don&apos;t have
              access to it.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col p-4">
        <ChatPageClient
          conversationId={id}
          customerPhone={conversation.customer_phone}
          status={conversation.status}
          lastSeen={
            messages && messages.length > 0
              ? formatLastSeen(messages[messages.length - 1]?.timestamp)
              : undefined
          }
          lastMessageTimestamp={
            messages && messages.length > 0
              ? messages[messages.length - 1]?.timestamp
              : undefined
          }
          username={getUserName(user.email!)}
          initialMessages={messages || []}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading conversation:", error);
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-2rem)] m-4 rounded-2xl border bg-secondary-background/30">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground/80 mb-2">
            Error loading conversation
          </h2>
          <p className="text-sm text-foreground/60">
            Please try refreshing the page or contact support if the problem
            persists.
          </p>
        </div>
      </div>
    );
  }
}
