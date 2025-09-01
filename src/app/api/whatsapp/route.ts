import { getErrorMessage } from "@/lib/utils";
import { supabase } from "@/lib/services/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { userSchema } from "@/lib/schemas/user";
import { conversationSchema } from "@/lib/schemas/conversation";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"

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
    const msg = await client.messages.create({
      from: whatsappFrom,
      to: `whatsapp:${to}`,
      body: message,
    });

    const { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("customer_phone", to);

      let parsedConversation = conversationSchema.pick({ id: true }).parse(conversation);

    if (!conversation) {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("whatsapp_number", to);

      const parsedUser = userSchema.pick({ id: true }).parse(user);

      if (userError || !user) {
        throw userError;
      }

      const { data: newConversation, error: newConversationError } =
        await supabase
          .from("conversations")
          .insert({
            user_id: parsedUser.id,
            customer_phone: to,
            status: "active",
          })
          .select();

      if (newConversationError || !newConversation) {
        throw newConversationError;
      }

       parsedConversation = conversationSchema
        .pick({ id: true })
        .parse(newConversation[0]);
    }

    const { error: messageError } = await supabase.from("messages").insert({
      conversation_id: parsedConversation.id,
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
