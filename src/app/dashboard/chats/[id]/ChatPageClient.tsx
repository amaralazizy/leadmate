"use client";

import { RealtimeChat } from "@/components/dashboard/chats/realtime-chat";
import ChatHeader from "@/components/dashboard/chats/ChatHeader";
import { useMessageReadTracking } from "@/hooks/useMessageReadTracking";
import type { ChatMessage } from "@/hooks/use-realtime-chat";

interface ChatPageClientProps {
  conversationId: string;
  customerPhone: string;
  status: string;
  lastSeen?: string;
  lastMessageTimestamp?: string;
  username: string;
  initialMessages: ChatMessage[];
}

export default function ChatPageClient({
  conversationId,
  customerPhone,
  status,
  lastSeen,
  lastMessageTimestamp,
  username,
  initialMessages,
}: ChatPageClientProps) {
  // Track read status for messages
  useMessageReadTracking({
    conversationId,
    messages: initialMessages,
    enabled: true,
  });

  return (
    <div className="flex flex-col flex-1 rounded-2xl border overflow-hidden bg-background shadow-lg">
      <ChatHeader
        conversationId={conversationId}
        customerPhone={customerPhone}
        status={status}
        lastSeen={lastSeen}
        lastMessageTimestamp={lastMessageTimestamp}
      />
      <div className="flex-1 min-h-0">
        <RealtimeChat
          roomName={conversationId}
          username={username}
          messages={initialMessages}
        />
      </div>
    </div>
  );
}
