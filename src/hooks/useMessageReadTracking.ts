import { useEffect, useRef, useCallback } from "react";
import { markConversationAsRead } from "@/actions";

export interface UseMessageReadTrackingProps {
  conversationId: string;
  messages: Array<{ id: string; is_read?: boolean; sender: string }>;
  enabled?: boolean;
}

export function useMessageReadTracking({
  conversationId,
  messages,
  enabled = true,
}: UseMessageReadTrackingProps) {
  const hasMarkedAsRead = useRef(false);
  const lastMessageCount = useRef(0);

  const markAsRead = useCallback(async () => {
    if (!enabled || !conversationId) return;

    try {
      await markConversationAsRead(conversationId);
      hasMarkedAsRead.current = true;
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
    }
  }, [conversationId, enabled]);

  useEffect(() => {
    if (!enabled || !messages?.length) return;

    // Check if there are any unread customer messages
    const hasUnreadCustomerMessages = messages.some(
      (msg) => msg.sender === "customer" && msg.is_read === false
    );

    // If there are new messages or unread messages, mark conversation as read
    const hasNewMessages = messages.length > lastMessageCount.current;

    if (
      (hasUnreadCustomerMessages || hasNewMessages) &&
      !hasMarkedAsRead.current
    ) {
      // Use a small delay to ensure the user has "seen" the messages
      const timer = setTimeout(() => {
        markAsRead();
      }, 1000); // 1 second delay

      lastMessageCount.current = messages.length;

      return () => clearTimeout(timer);
    }
  }, [messages, markAsRead, enabled]);

  // Reset tracking when conversation changes
  useEffect(() => {
    hasMarkedAsRead.current = false;
    lastMessageCount.current = 0;
  }, [conversationId]);

  return {
    markAsRead,
  };
}
