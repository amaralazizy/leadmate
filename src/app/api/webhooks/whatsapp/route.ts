import { NextRequest, NextResponse } from "next/server";
import { messageSchema } from "@/lib/schemas/message";
import twilio from "twilio";
import OpenAI from "openai";
import { Conversation } from "@/lib/types/chat";
import { extractLead } from "@/lib/services/openai/openai";
import { createServiceClient } from "@/lib/supabase/service";

const apiKey = process.env.OPENROUTER_API_KEY!;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
});

// Create dynamic system prompt based on business knowledge
function createSystemPrompt(
  businessName: string,
  businessType: string,
  knowledgeBase: string
): string {
  return `You are an AI customer support assistant for ${businessName}${
    businessType ? `, a ${businessType}` : ""
  }. You are responding to customers via WhatsApp and your primary goal is to provide exceptional customer service while representing the business professionally.

🎯 **CORE MISSION**: 
- Provide accurate, helpful information based ONLY on the business knowledge provided
- Satisfy customer needs and exceed their expectations
- Convert inquiries into positive business outcomes (sales, bookings, appointments)
- Build trust and rapport with every interaction

💼 **COMMUNICATION EXCELLENCE**:
- Be warm, professional, and genuinely helpful
- Use a conversational WhatsApp tone with appropriate emojis 
- Keep responses concise but complete (2-4 sentences ideal)
- Always acknowledge the customer's needs first
- Provide specific, actionable information
- Use "we" and "our" to represent the business

🚀 **CUSTOMER SUPPORT PRIORITIES**:
1. **Answer questions accurately** using the business knowledge base
2. **Provide pricing, availability, and service details** when asked
3. **Guide customers toward making purchases/bookings**
4. **Handle complaints with empathy** and offer solutions
5. **Collect contact information** when appropriate for follow-up
6. **Suggest alternatives** if something isn't available

📱 **WhatsApp BEST PRACTICES**:
- Respond quickly and enthusiastically
- Use emojis to convey warmth (but don't overdo it)
- Break up long information into digestible chunks
- Always end with a clear next step or call-to-action
- Be conversational, not robotic

⚠️ **CRITICAL RULES**:
- ONLY use information from the provided business knowledge base
- If you don't know something, say "Let me check on that for you" and suggest they contact the business directly
- Never make up prices, availability, or policies
- Never mention competitors or other businesses
- Always stay in character as representing THIS business
- Focus on solutions, not problems

🎯 **LEAD CONVERSION TACTICS**:
- Ask qualifying questions to understand customer needs
- Highlight benefits and unique selling points
- Create urgency when appropriate (limited availability, special offers)
- Make it easy for customers to take the next step
- Collect names and contact details naturally in conversation

**BUSINESS KNOWLEDGE BASE:**
${knowledgeBase}

**Remember**: You ARE this business. Every response should feel like it's coming directly from a knowledgeable, caring team member who wants to help the customer have the best possible experience.`;
}

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(request: NextRequest) {
  try {
    console.log("🔥 Webhook POST request received");
    console.log("🔗 Request URL:", request.url);
    console.log("🎯 Request method:", request.method);
    console.log(
      "📋 Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    const supabase = createServiceClient();
    const body = await request.text();
    const params = new URLSearchParams(body);

    const from = params.get("From");
    const messageBody = params.get("Body") || "";
    const to = params.get("To");

    // Clean phone numbers (remove whatsapp: prefix)
    const customerPhone = from?.replace("whatsapp:", "");
    const businessPhone = to?.replace("whatsapp:", "");

    console.log("customerPhone", customerPhone);
    console.log("businessPhone", businessPhone);
    console.log("messageBody", messageBody);

    // Find the business user by WhatsApp number
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("whatsapp_number", businessPhone)
      .single();

    if (userError || !user) {
      console.error("Business user not found:", userError);
      return NextResponse.json(
        { error: "Business not found", details: userError },
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
    let conversation: Conversation | null = null;
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
        conversation_id: conversation?.id,
        content: messageBody,
        sender: "customer",
      });

    const { error: messageError } = await supabase
      .from("messages")
      .insert(parsedMessage);

    if (messageError) {
      throw messageError;
    }

    // Get business knowledge base for context
    const { data: knowledgeData } = await supabase
      .from("knowledge_base")
      .select("content")
      .eq("user_id", user.id);

    const knowledgeBase =
      knowledgeData?.map((k) => k.content).join("\n\n") ||
      "No specific business knowledge available. Please provide general helpful customer service.";

    // Create dynamic system prompt based on business info and knowledge
    const systemPrompt = createSystemPrompt(
      user.business_name || "our business",
      user.business_type || "",
      knowledgeBase
    );

    // Get previous messages for conversation context
    const { data: previousMessages } = await supabase
      .from("messages")
      .select("content, sender")
      .eq("conversation_id", conversation?.id)
      .order("timestamp", { ascending: true })
      .limit(10);

    // Build conversation history
    const conversationHistory =
      previousMessages?.map((msg) => ({
        role:
          msg.sender === "customer"
            ? ("user" as const)
            : ("assistant" as const),
        content: msg.content,
      })) || [];

    // Add current message
    conversationHistory.push({
      role: "user" as const,
      content: messageBody,
    });

    let aiResponse = "";

    try {
      // Generate AI response using the LLM with dynamic context
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-4-scout:free",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          ...conversationHistory,
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      aiResponse =
        completion.choices[0]?.message?.content ||
        "I apologize, but I'm having trouble processing your message right now. Please try again in a moment.";

      console.log("🤖 AI Response:", aiResponse);

      //TODO: extract the lead from the ai response and update the lead with the extracted information

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
          .eq("conversation_id", conversation?.id);
      }
    } catch (aiError) {
      console.error("AI response failed:", aiError);
      // Fallback to simple response if AI fails
      if (messageBody.toLowerCase().includes("pricing")) {
        aiResponse =
          "💰 Thanks for your interest in pricing. Someone will contact you soon with details!";
      } else if (messageBody.toLowerCase().includes("help")) {
        aiResponse =
          "🤖 Thank you for reaching out! We're here to help. Someone will be with you shortly.";
      } else {
        aiResponse =
          "🤖 Thank you for reaching out! We're here to help. Someone will be with you shortly.";
      }
    }

    // Send auto-response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(aiResponse);

    // Save bot response message
    const botMessageParsed = messageSchema
      .omit({ id: true, timestamp: true })
      .parse({
        conversation_id: conversation!.id,
        content: aiResponse,
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
    console.error("❌ Error in webhook:", error);

    // Fallback response in case of error
    const fallbackResponse =
      "I apologize, but I'm experiencing some technical difficulties right now. Please try messaging again in a few moments, or contact our support team directly.";

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(fallbackResponse);

    return new Response(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}

// Add a GET method for testing webhook endpoint accessibility
export async function GET() {
  console.log("🔥 Webhook GET request received - endpoint is accessible");
  return NextResponse.json({
    message: "WhatsApp webhook endpoint is working",
    timestamp: new Date().toISOString(),
    status: "ok",
  });
}
