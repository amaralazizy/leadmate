"use server";
import { createClient } from "./lib/supabase/server";

export async function getChats() {
  const supabase = await createClient();
  const { data: chats, error } = await supabase.from("conversations").select("*");
  if (error) {
    throw error;
  }
  return chats;
}

export async function getChatById(id: string) {
  const supabase = await createClient();
  const { data: chat, error } = await supabase.from("conversations").select("*").eq("id", id).single();
  if (error) {
    throw error;
  }
  return chat;
}

export async function storeMessage(message: string, conversationId: string) {
  const supabase = await createClient();
  const { data: newMessage, error } = await supabase.from("messages").insert({
    content: message,
    conversation_id: conversationId,
  });
  if (error) {
    throw error;
  }
  return message;
}