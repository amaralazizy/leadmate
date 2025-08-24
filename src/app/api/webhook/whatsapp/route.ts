import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client";
import { generateChatResponse, extractLead } from "@/lib/openai";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);

    const from = params.get("From");
    const messageBody = params.get("Body");
    const to = params.get("To");

    if (!from || !messageBody || !to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the business user by WhatsApp number
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("whatsapp_number", to.replace("whatsapp:", ""))
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Check usage quota
    if (user.usage_count >= user.usage_limit) {
      await twilioClient.messages.create({
        body: "This business has reached their monthly quota. Please try again next month.",
        from: to,
        to: from,
      });
      return NextResponse.json({ message: "Quota exceeded" }, { status: 200 });
    }

    // Find or create conversation
    let conversation;
    const { data: existingConversation } = await supabaseAdmin
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .eq("customer_phone", from)
      .eq("status", "active")
      .single();

    if (existingConversation) {
      conversation = existingConversation;
    } else {
      const { data: newConversation } = await supabaseAdmin
        .from("conversations")
        .insert({
          user_id: user.id,
          customer_phone: from,
          status: "active",
        })
        .select()
        .single();

      conversation = newConversation;
    }

    // Save customer message
    await supabaseAdmin.from("messages").insert({
      conversation_id: conversation.id,
      content: messageBody,
      sender: "customer",
    });

    // Get relevant knowledge base content
    const { data: knowledge } = await supabaseAdmin
      .from("knowledge_base")
      .select("content")
      .eq("user_id", user.id)
      .limit(5);

    const context = knowledge?.map((k) => k.content).join("\n") || "";

    // Generate AI response
    const aiResponse = await generateChatResponse(
      [{ role: "user", content: messageBody }],
      context
    );

    // Extract lead if present
    const lead = extractLead(aiResponse);
    if (lead) {
      await supabaseAdmin.from("leads").insert({
        user_id: user.id,
        conversation_id: conversation.id,
        type: lead.type,
        customer_name: lead.customer.name,
        customer_phone: from,
        details: lead.details,
        status: "new",
      });
    }

    // Clean response for WhatsApp (remove lead markers)
    const cleanResponse = aiResponse.replace(/\[LEAD:.*?\]/g, "").trim();

    // Send AI response
    await twilioClient.messages.create({
      body: cleanResponse,
      from: to,
      to: from,
    });

    // Save bot message
    await supabaseAdmin.from("messages").insert({
      conversation_id: conversation.id,
      content: cleanResponse,
      sender: "bot",
    });

    // Update usage count
    await supabaseAdmin
      .from("users")
      .update({ usage_count: user.usage_count + 1 })
      .eq("id", user.id);

    return NextResponse.json({ message: "Message processed" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
