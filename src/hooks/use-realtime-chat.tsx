"use client";

import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storeMessage } from "@/actions";

interface UseRealtimeChatProps {
  roomName: string;
  username: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "customer" | "bot";
  timestamp: string;
  conversation_id: string;
  is_read?: boolean;
}

export function useRealtimeChat({ roomName, username }: UseRealtimeChatProps) {
  const supabase = createClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channel, setChannel] = useState<ReturnType<
    typeof supabase.channel
  > | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const router = useRouter();

  // Load initial messages from database
  useEffect(() => {
    const loadInitialMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Load messages for this conversation (roomName should be conversation_id)
      const { data: dbMessages } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", roomName)
        .order("timestamp", { ascending: true });

      if (dbMessages) {
        const formattedMessages: ChatMessage[] = dbMessages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: msg.timestamp,
          conversation_id: msg.conversation_id,
          is_read: msg.is_read,
        }));
        setMessages(formattedMessages);
      }
    };

    loadInitialMessages();
  }, [roomName, username, supabase]);

  useEffect(() => {
    // Only set up subscription if we have a valid room name
    if (!roomName) return;

    const setupRealtimeSubscription = async () => {
      // Ensure user is authenticated before setting up subscription
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setIsConnected(false);
        return null;
      }

      const newChannel = supabase
        .channel(`messages_${roomName}`, {
          config: {
            presence: {
              key: user.id,
            },
          },
        })
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${roomName}`,
          },
          (payload) => {
            const newMessage = payload.new as ChatMessage;

            // Verify this message belongs to a conversation owned by the current user
            if (newMessage.conversation_id === roomName) {
              const formattedMessage: ChatMessage = {
                id: newMessage.id,
                content: newMessage.content,
                sender: newMessage.sender,
                timestamp: newMessage.timestamp,
                conversation_id: newMessage.conversation_id,
              };

              setMessages((current) => {
                // Avoid duplicates
                if (current.find((msg) => msg.id === formattedMessage.id)) {
                  return current;
                }
                return [...current, formattedMessage];
              });
            }
          }
        )
        .subscribe(async (status, err) => {
          if (status === "SUBSCRIBED") {
            setIsConnected(true);
          } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
            setIsConnected(false);
          }
        });

      setChannel(newChannel);
      return newChannel;
    };

    const channelPromise = setupRealtimeSubscription();

    return () => {
      channelPromise.then((newChannel) => {
        if (newChannel) {
          supabase.removeChannel(newChannel);
        }
      });
    };
  }, [roomName, username, supabase]);

  const sendMessage = useCallback(
    async (content: string, sender: "customer" | "bot" = "bot") => {
      if (!isConnected || !content.trim()) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("user not found");
        router.push("/login");
        return;
      }

      try {
        // Store message in database - realtime will automatically update UI
        await storeMessage(content, roomName, sender);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    },
    [isConnected, roomName, router, supabase]
  );

  return { messages, sendMessage, isConnected };
}
