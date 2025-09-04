//import { NextResponse } from "next/server";
import twilio from "twilio";
import OpenAI from "openai";

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

export async function POST(req: Request) {
  const twiml = new twilio.twiml.MessagingResponse();
  const body = await req.formData();

  const incomingMsg = body.get("Body") as string;
  const from = body.get("From") as string;

  console.log("📩 Incoming message:", incomingMsg, "from:", from);

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
          content: incomingMsg,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse =
      completion.choices[0]?.message?.content ||
      "I apologize, but I'm having trouble processing your message right now. Please try again in a moment.";

    console.log("🤖 AI Response:", aiResponse);

    twiml.message(aiResponse);

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
