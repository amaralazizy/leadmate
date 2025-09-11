"use server";
import { createClient } from "@/lib/supabase/server";

export async function getChats(user_id: string) {
  const supabase = await createClient();
  const { data: chats, error } = await supabase
    .from("conversations")
    .select(
      `
      id,
      customer_phone,
      status,
      created_at,
      updated_at,
      messages (
        content,
        timestamp, 
        sender
      )
    `
    )
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  // Transform the data to match what the UI expects
  return (
    chats?.map((chat) => ({
      id: chat.id,
      name: chat.customer_phone, // Use phone as name for now
      lastMessage:
        chat.messages?.[chat.messages.length - 1]?.content || "No messages yet",
      time: new Date(chat.updated_at).toLocaleTimeString(),
      timestamp: chat.updated_at, // Raw timestamp for activity checking
      customer_phone: chat.customer_phone,
      status: chat.status,
    })) || []
  );
}

export async function getChatById(id: string) {
  const supabase = await createClient();
  const { data: chat, error } = await supabase
    .from("conversations")
    .select(
      `
      id,
      customer_phone,
      status,
      created_at,
      updated_at,
      messages (
        id,
        content,
        timestamp,
        sender
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }
  return chat;
}

export async function getMessagesByConversationId(conversationId: string) {
  const supabase = await createClient();

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("timestamp", { ascending: true });

  if (error) {
    throw error;
  }
  return messages;
}

export async function storeMessage(
  message: string,
  conversationId: string,
  sender: "customer" | "bot" = "bot"
) {
  const supabase = await createClient();
  const { data: newMessage, error } = await supabase.from("messages").insert({
    content: message,
    conversation_id: conversationId,
    sender: sender,
  });
  if (error) {
    console.error("Database error storing message:", error);
    throw error;
  }
  return newMessage;
}
