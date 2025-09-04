import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/services/supabase/server";
import { conversationSchema } from "@/lib/schemas/conversation";
import { leadSchema } from "@/lib/schemas/lead";
import { messageSchema } from "@/lib/schemas/message";
import { getErrorMessage } from "@/lib/utils";
import twilio from "twilio";
import OpenAI from "openai";
import { Conversation } from "@/lib/types/chat";
import { extractLead } from "@/lib/services/openai/openai";

const apiKey = process.env.OPENROUTER_API_KEY!;

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
});

// Restaurant business profile
const RESTAURANT_PROFILE = {
  name: "Bella Vista Ristorante",
  type: "Authentic Italian Restaurant",
  description:
    "A family-owned Italian restaurant serving traditional dishes made with fresh, locally-sourced ingredients in a warm, welcoming atmosphere.",
  address: "123 Main Street, Downtown",
  phone: "+1 (555) 123-4567",
  hours: "Tuesday-Sunday: 11:00 AM - 10:00 PM (Closed Mondays)",
  specialties: [
    "Wood-fired pizzas",
    "Fresh pasta",
    "Authentic Italian desserts",
    "Fine wines",
  ],
  menu: {
    appetizers: [
      "Bruschetta al Pomodoro - $8",
      "Calamari Fritti - $12",
      "Caprese Salad - $10",
      "Antipasto Misto - $15",
    ],
    main_courses: [
      "Spaghetti Carbonara - $18",
      "Margherita Pizza - $16",
      "Chicken Parmigiana - $22",
      "Beef Lasagna - $20",
      "Grilled Salmon - $26",
    ],
    desserts: ["Tiramisu - $8", "Cannoli - $7", "Gelato - $6"],
    beverages: [
      "Italian Sodas - $4",
      "Espresso - $3",
      "Wine Selection - $8-15/glass",
    ],
  },
  policies: {
    reservations: "Reservations recommended for dinner",
    delivery: "Available through our delivery partners",
    takeout: "Takeout orders welcome",
    special_events: "Private dining available for groups of 8+",
  },
};

// General business-agnostic system prompt
const SYSTEM_PROMPT = `You are ${RESTAURANT_PROFILE.name}, a ${
  RESTAURANT_PROFILE.type
}. You are speaking directly to customers who have messaged your business on WhatsApp. Your role is to:

🎯 **Core Purpose**: Represent ${
  RESTAURANT_PROFILE.name
} professionally and help customers with their needs.

💼 **Business Communication Style**:
- Be warm, welcoming, and authentically represent your business type
- Use appropriate emojis to make responses friendly and engaging
- Keep responses concise but informative (2-4 sentences max)
- Always maintain a helpful and solution-oriented approach
- Use "we" and "our" to represent your business
- Never mention any other service - you ARE the business

🚀 **Key Capabilities**:
- Answer questions about your products, services, and business operations
- Provide information about hours, location, and policies
- Handle customer inquiries professionally
- Suggest solutions based on customer needs
- Share information about your business experience
- Handle any service-related questions

📱 **WhatsApp Best Practices**:
- Keep messages conversational and easy to read
- Use bullet points or emojis for better readability
- Avoid overly formal language
- Be responsive and helpful
- Always end with a friendly note or next step

🎨 **Tone Guidelines**:
- Warm and welcoming like a family business
- Professional but not robotic
- Confident about your products/services
- Patient and understanding
- Always positive and solution-focused
- Proud of your business offerings

**Business Information to Share:**
- We are ${RESTAURANT_PROFILE.description}
- Located at ${RESTAURANT_PROFILE.address}
- Open ${RESTAURANT_PROFILE.hours}
- Specializing in ${RESTAURANT_PROFILE.specialties.join(", ")}
- ${RESTAURANT_PROFILE.policies.reservations}
- ${RESTAURANT_PROFILE.policies.delivery}
- ${RESTAURANT_PROFILE.policies.takeout}

Remember: You ARE ${
  RESTAURANT_PROFILE.name
} speaking directly to customers. Every interaction should build excitement about your business and provide helpful information about your services.`;

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
    const messageBody = params.get("Body") || "";
    const to = params.get("To");

  try {

    // Clean phone numbers (remove whatsapp: prefix)
    const customerPhone = from?.replace("whatsapp:", "");
    const businessPhone = to?.replace("whatsapp:", "");

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
            .eq("user_id", user.id)
            .limit(5);
     
          const context = knowledgeData?.map((k) => k.content).join("\n") || "";
     
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
              role: msg.sender === "customer" ? "user" : ("assistant" as const),
              content: msg.content,
            })) || [];
     
          // Add current message
          conversationHistory.push({
            role: "user",
            content: messageBody,
          });
    try {
      
      
      // Generate AI response using the LLM
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-4-scout:free",
        messages: [
          {
            role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: conversationHistory.map((msg) => msg.content).join("\n"),
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    
    let aiResponse = "";
    completion.choices[0]?.message?.content ||
    "I apologize, but I'm having trouble processing your message right now. Please try again in a moment.";
    
    console.log("🤖 AI Response:", aiResponse);
    
    
    
    
    
    
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
        aiResponse = "💰 Thanks for your interest in pricing. Someone will contact you soon with details!";
      } else if (messageBody.toLowerCase().includes("help")) {
        aiResponse = "🤖 Thank you for reaching out! We're here to help. Someone will be with you shortly.";
      }
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
    console.error("❌ Error generating AI response:", error);

    // Fallback response in case of error
    const fallbackResponse =
      "I apologize, but I'm experiencing some technical difficulties right now. Please try messaging again in a few moments, or contact our support team directly.";

    twiml.message(fallbackResponse);

      return new Response(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }
  }
