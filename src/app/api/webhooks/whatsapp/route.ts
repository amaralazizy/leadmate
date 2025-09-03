import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/services/supabase/server";
import { conversationSchema } from "@/lib/schemas/conversation";
import { leadSchema } from "@/lib/schemas/lead";
import { messageSchema } from "@/lib/schemas/message";
import { getErrorMessage } from "@/lib/utils";
import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
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

    // Clean phone numbers (remove whatsapp: prefix)
    const customerPhone = from.replace("whatsapp:", "");
    const businessPhone = to.replace("whatsapp:", "");

    // Find the business user by WhatsApp number
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("whatsapp_number", businessPhone)
      .single();

    if (userError || !user) {
      console.error("Business user not found:", userError);
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Check usage quota
    if (user.usage_count >= user.usage_limit) {
      const twiml = new twilio.twiml.MessagingResponse();
      twiml.message(
        "This business has reached their monthly quota. Please try again next month."
      );
      return new Response(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Find or create conversation and lead atomically for new customers
    let conversation;
    const { data: existingConversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .eq("customer_phone", customerPhone)
      .eq("status", "active")
      .single();

    if (existingConversation) {
      conversation = existingConversation;
    } else {
      // ALWAYS create lead for ANY new customer who messages the business
      const { data: result, error: rpcError } = await supabase.rpc(
        "create_lead_with_conversation",
        {
          p_user_id: user.id,
          p_customer_phone: customerPhone,
          p_customer_name: "Unknown", // Will be updated when we get customer info
          p_lead_type: "inquiry", // Default type for new leads from WhatsApp
          p_details: `First message: ${messageBody}`,
          p_conversation_status: "active",
          p_lead_status: "new",
        }
      );

      if (rpcError) {
        throw rpcError;
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

    // Save customer message with schema validation
    const parsedMessage = messageSchema
      .omit({ id: true, timestamp: true })
      .parse({
        conversation_id: conversation.id,
        content: messageBody,
        sender: "customer",
      });

    const { error: messageError } = await supabase
      .from("messages")
      .insert(parsedMessage);

    if (messageError) {
      throw messageError;
    }

    // Generate AI-powered response
    let reply =
      "👋 Hello! Thanks for messaging us. We'll get back to you shortly.";

    try {
      // Get business knowledge base for context
      const { data: knowledgeData } = await supabase
        .from("knowledge_base")
        .select("content")
        .eq("user_id", user.id)
        .limit(5);

      const context = knowledgeData?.map((k) => k.content).join("\n") || "";

      // Get previous messages for conversation context
      const { data: previousMessages } = await supabase
        .from("messages")
        .select("content, sender")
        .eq("conversation_id", conversation.id)
        .order("timestamp", { ascending: true })
        .limit(10);

      // Build conversation history
      const conversationHistory =
        previousMessages?.map((msg) => ({
          role: msg.sender === "customer" ? "user" : ("assistant" as const),
          content: msg.content,
        })) || [];

      // Add current message
      conversationHistory.push({
        role: "user",
        content: messageBody,
      });

      // Use OpenAI for intelligent response
      const { generateChatResponse, extractLead } = await import(
        "@/lib/services/openai/openai"
      );

      const aiResponse = await generateChatResponse(
        conversationHistory,
        context
      );
      reply = aiResponse;

      // Check if AI detected a lead
      const leadInfo = extractLead(aiResponse);
      if (leadInfo && leadInfo.customer.name && leadInfo.customer.phone) {
        // Update the lead with extracted information
        await supabase
          .from("leads")
          .update({
            customer_name: leadInfo.customer.name,
            type: leadInfo.type,
            details: leadInfo.details,
            status: "contacted",
          })
          .eq("conversation_id", conversation.id);
      }
    } catch (aiError) {
      console.error("AI response failed:", aiError);
      // Fallback to simple response if AI fails
      if (messageBody.toLowerCase().includes("pricing")) {
        reply =
          "💰 Thanks for your interest in pricing. Someone will contact you soon with details!";
      } else if (messageBody.toLowerCase().includes("help")) {
        reply =
          "🤖 Thank you for reaching out! We're here to help. Someone will be with you shortly.";
      }
    }

    // Send auto-response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(reply);

    // Save bot response message
    const botMessageParsed = messageSchema
      .omit({ id: true, timestamp: true })
      .parse({
        conversation_id: conversation.id,
        content: reply,
        sender: "bot",
      });

    await supabase.from("messages").insert(botMessageParsed);

    // Update usage count
    await supabase
      .from("users")
      .update({ usage_count: user.usage_count + 1 })
      .eq("id", user.id);

    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(
      "Sorry, we're experiencing technical difficulties. Please try again later."
    );
    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
