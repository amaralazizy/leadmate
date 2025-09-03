import { getErrorMessage } from "@/lib/utils";
import { supabase } from "@/lib/services/supabase/client";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { env } from "@/lib/config/env";
import twilio from "twilio";
// import { conversationSchema } from "@/lib/schemas/conversation";

export async function POST(req: NextRequest) {
  const { to, message, customerName } = await req.json();

  const accountSid = env.TWILIO_ACCOUNT_SID;
  const authToken = env.TWILIO_AUTH_TOKEN;
  const whatsappFrom = env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

  if (!accountSid || !authToken || !whatsappFrom) {
    return NextResponse.json(
      {
        success: false,
        error: "Twilio environment variables are not configured",
      },
      { status: 500 }
    );
  }

  const client = twilio(accountSid, authToken);

  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user", user);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Send WhatsApp message
    const msg = await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${to}`,
      body: message,
    });

    // Find or create conversation (with optional lead creation)
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .eq("customer_phone", to)
      .eq("status", "active")
      .single();

    let conversation = existingConversation;
    if (!existingConversation) {
      // ALWAYS create lead when business initiates contact with new customer
      const { data: result, error: rpcError } = await supabase.rpc(
        "create_lead_with_conversation",
        {
          p_user_id: user.id,
          p_customer_phone: to,
          p_customer_name: customerName || "Unknown",
          p_lead_type: "inquiry",
          p_details: `Business initiated contact: ${message}`,
          p_conversation_status: "active",
          p_lead_status: "new",
        }
      );

      if (rpcError || !result?.success) {
        throw new Error(
          result?.error ||
            rpcError?.message ||
            "Failed to create conversation and lead"
        );
      }

      // Get the created conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", result.conversation_id)
        .single();

      if (conversationError) {
        throw conversationError;
      }
      conversation = newConversation;
    }

    // Save bot message
    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      content: message,
      sender: "bot",
    });

    if (messageError) {
      throw messageError;
    }

    return NextResponse.json({ success: true, sid: msg.sid });
  } catch (error) {
    return NextResponse.json({ success: false, error: getErrorMessage(error) });
  }
}
