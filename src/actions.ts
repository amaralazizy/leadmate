"use server";
import { createClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils/utils";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";
import { updateMessageReadSchema } from "@/lib/schemas";

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

export type SignupFormData = {
  email: string;
  password: string;
  businessName: string;
  username: string;
};

export const handleSignup = async (
  prevState: TprevSate<SignupFormData>,
  formData: FormData
): Promise<TprevSate<SignupFormData> & { needsVerification?: boolean }> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const businessName = formData.get("businessName") as string;
  const username = formData.get("username") as string;

  const inputs = { email, password, businessName, username };

  // Basic validation
  const errors: Partial<Record<keyof SignupFormData | "supabase", string[]>> =
    {};

  if (!email || !email.includes("@")) {
    errors.email = ["Please enter a valid email address"];
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters"];
  }

  if (!businessName || businessName.trim().length < 2) {
    errors.businessName = ["Business name must be at least 2 characters"];
  }

  if (!username || username.trim().length < 2) {
    errors.username = ["Username must be at least 2 characters"];
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    errors.username = [
      "Username can only contain letters, numbers, dots, dashes, and underscores",
    ];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      inputs,
    };
  }

  try {
    const supabase = await createClient();

    // Check if email or username already exists in public.users table
    console.log("Checking if email and username already exist...");
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .limit(1);
    if (checkError) {
      throw checkError;
    } else if (existingUsers && existingUsers.length > 0) {
      const emailExists = existingUsers.some((user) => user.email === email);

      const errors: Partial<
        Record<keyof SignupFormData | "supabase", string[]>
      > = {};

      if (emailExists) {
        errors.email = ["An account with this email already exists"];
      }

      if (Object.keys(errors).length > 0) {
        return {
          success: false,
          errors,
          inputs,
        };
      }
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          business_name: businessName,
          username: username,
        },
      },
    });

    console.log("signUpError", signUpError);

    if (signUpError) {
      // Handle specific error cases for duplicate emails
      if (
        signUpError.message.toLowerCase().includes("already registered") ||
        signUpError.message.toLowerCase().includes("already exists") ||
        signUpError.message.toLowerCase().includes("user already registered")
      ) {
        return {
          success: false,
          errors: {
            email: [
              "An account with this email already exists. Please try logging in instead.",
            ],
          },
          inputs,
        };
      }

      // Handle rate limiting
      if (signUpError.message.toLowerCase().includes("rate limit")) {
        return {
          success: false,
          errors: {
            supabase: [
              "Too many signup attempts. Please wait a moment and try again.",
            ],
          },
          inputs,
        };
      }

      return {
        success: false,
        errors: { supabase: [signUpError.message] },
        inputs,
      };
    }

    return {
      success: true,
      inputs,
      needsVerification: true,
    };
  } catch (error) {
    return {
      success: false,
      errors: { supabase: [getErrorMessage(error)] },
      inputs,
    };
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
        sender,
        is_read
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
    chats?.map((chat) => {
      // Count unread customer messages
      const unreadCount =
        chat.messages?.filter(
          (msg: { sender: string; is_read: boolean }) =>
            msg.sender === "customer" && msg.is_read === false
        ).length || 0;

      return {
        id: chat.id,
        name: chat.customer_phone, // Use phone as name for now
        lastMessage:
          chat.messages?.[chat.messages.length - 1]?.content ||
          "No messages yet",
        time: new Date(chat.updated_at).toLocaleTimeString(),
        timestamp: chat.updated_at, // Raw timestamp for activity checking
        customer_phone: chat.customer_phone,
        status: chat.status,
        unreadCount,
      };
    }) || []
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
    is_read: false, // New messages start as unread
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

export async function markMessagesAsRead(
  messageIds: string[],
  isRead: boolean = true
) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Validate input using Zod schema
  const validatedData = updateMessageReadSchema.parse({
    messageIds,
    isRead,
  });

  // First get conversation IDs owned by the user
  const { data: userConversations, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id);

  if (convError) {
    console.error("Error fetching user conversations:", convError);
    throw convError;
  }

  const conversationIds = userConversations?.map((conv) => conv.id) || [];

  // Update messages read status - only for messages in conversations owned by the user
  const { error } = await supabase
    .from("messages")
    .update({ is_read: validatedData.isRead })
    .in("id", validatedData.messageIds)
    .in("conversation_id", conversationIds);

  if (error) {
    console.error("Error updating message read status:", error);
    throw error;
  }

  return { success: true };
}

export async function markConversationAsRead(conversationId: string) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // First verify the conversation belongs to the user
  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (convError || !conversation) {
    throw new Error("Conversation not found or access denied");
  }

  // Get all unread messages in this conversation
  const { data: unreadMessages, error: fetchError } = await supabase
    .from("messages")
    .select("id")
    .eq("conversation_id", conversationId)
    .eq("is_read", false);

  if (fetchError) {
    console.error("Error fetching unread messages:", fetchError);
    throw fetchError;
  }

  if (!unreadMessages || unreadMessages.length === 0) {
    return { success: true, updated: 0 };
  }

  // Mark all unread messages as read
  const messageIds = unreadMessages.map((msg) => msg.id);
  await markMessagesAsRead(messageIds, true);

  return { success: true, updated: messageIds.length };
}
