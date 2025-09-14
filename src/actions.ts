"use server";
import { createClient } from "@/lib/supabase/server";
import { getErrorMessage } from "./lib/utils";
import { revalidatePath } from "next/cache";
export type TprevSate<T> = {
  success: boolean;
  errors?: Partial<Record<keyof T | "supabase", string[]>>;
  inputs: T;
};

export const handleLogout = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    revalidatePath("/", "layout");
    return { message: "User logged out successfully" };
  } catch (error) {
    return { message: getErrorMessage(error) };
  }
};

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

export async function getActiveChatsCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  // get total number of conversations for the current user
  const { count, error } = await supabase
    .from("conversations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);
  console.log(count);
  if (error) {
    throw error;
  }
  return count;
}

export async function getNewMessagesCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get message count by joining with conversations
  const { count, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      conversations!inner (
        user_id
      )
    `,
      { count: "exact", head: true }
    )
    .eq("conversations.user_id", user.id)
    .eq("is_read", false);

  if (error) {
    throw error;
  }

  return count;
}

export async function getLeadsCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { count, error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  return count || 0;
}

export async function getConversionRate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const [chatsResult, leadsResult] = await Promise.all([
    supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const chats = chatsResult.count || 0;
  const leads = leadsResult.count || 0;
  const rate = chats > 0 ? Math.round((leads / chats) * 100) : 0;

  return `${rate}%`;
}

export async function getTodayMessagesCount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const today = new Date().toISOString().split("T")[0];

  const { count, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      conversations!inner (
        user_id
      )
    `,
      { count: "exact", head: true }
    )
    .eq("conversations.user_id", user.id)
    .gte("timestamp", `${today}T00:00:00.000Z`);

  if (error) {
    throw error;
  }

  return count || 0;
}

export async function getAvgMessagesPerChat() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const [messagesResult, chatsResult] = await Promise.all([
    supabase
      .from("messages")
      .select(
        `
        id,
        conversations!inner (
          user_id
        )
      `,
        { count: "exact", head: true }
      )
      .eq("conversations.user_id", user.id),
    supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const totalMessages = messagesResult.count || 0;
  const totalChats = chatsResult.count || 0;

  if (totalChats === 0) return "0";

  const avg = Math.round((totalMessages / totalChats) * 10) / 10; // Round to 1 decimal
  return avg.toString();
}
