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
  user: {
    name: string;
    id: string;
  };
  lead: {
    id: string;
  };
  createdAt: string;
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
        console.log("dbMessages", dbMessages);
        const formattedMessages: ChatMessage[] = dbMessages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          user: {
            name: msg.sender === "customer" ? "Customer" : username,
            id: msg.sender === "customer" ? "customer" : user.id,
          },
          lead: { id: user.id },
          createdAt: msg.timestamp,
        }));
        setMessages(formattedMessages);
      }
    };

    loadInitialMessages();
  }, [roomName, username, supabase]);

  useEffect(() => {
    const newChannel = supabase
      .channel(`messages:${roomName}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${roomName}`,
        },
        (payload) => {
          const newMessage = payload.new as any;
          const formattedMessage: ChatMessage = {
            id: newMessage.id,
            content: newMessage.content,
            user: {
              name: newMessage.sender === "customer" ? "Customer" : username,
              id:
                newMessage.sender === "customer"
                  ? "customer"
                  : newMessage.user_id || "",
            },
            lead: { id: newMessage.user_id || "" },
            createdAt: newMessage.timestamp,
          };

          setMessages((current) => {
            // Avoid duplicates
            if (current.find((msg) => msg.id === formattedMessage.id)) {
              return current;
            }
            return [...current, formattedMessage];
          });
        }
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
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
