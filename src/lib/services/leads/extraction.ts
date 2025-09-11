import OpenAI from "openai";
import { createServiceClient } from "@/lib/supabase/service";
import {
  shouldExtractByTime,
  getConversationTimestamps,
  type TimeBasedTrigger,
} from "./triggers";

const apiKey = process.env.OPENROUTER_API_KEY!;

const extractionClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
});

export interface ExtractedUserInfo {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  company?: string;
  intent?: "inquiry" | "booking" | "order" | "support";
  urgency?: "low" | "medium" | "high";
  budget?: string;
  preferences?: string[];
  followUpNeeded?: boolean;
  confidence?: number;
}

export interface LeadExtractionResult {
  userInfo: ExtractedUserInfo;
  shouldUpdateLead: boolean;
  suggestedQuestions: string[];
  leadScore: number;
}

/**
 * Enhanced system prompt for information extraction
 */
function createExtractionPrompt(): string {
  return `You are an expert information extraction AI. Your task is to analyze WhatsApp conversations and extract customer information.

EXTRACTION RULES:
1. Analyze the ENTIRE conversation history, not just the latest message
2. Extract ALL available information about the customer
3. Identify customer intent and urgency level
4. Suggest follow-up questions for missing critical information
5. Score the lead quality (0-100)

INFORMATION TO EXTRACT:
- Name (first name, last name, or business name)
- Phone numbers (any format)
- Email addresses
- Location (city, area, address)
- Company/business name
- Intent type (inquiry/booking/order/support)
- Urgency level (low/medium/high)
- Budget mentions or price discussions
- Specific preferences or requirements
- Timeline mentions

INTENT DETECTION:
- "inquiry": General questions, information seeking
- "booking": Appointments, reservations, scheduling
- "order": Product purchases, service orders
- "support": Problems, complaints, technical help

URGENCY INDICATORS:
- High: "urgent", "ASAP", "today", "emergency", "immediately"
- Medium: "soon", "this week", "by Friday", timeline mentioned
- Low: "eventually", "when possible", no timeline

RESPONSE FORMAT - Return a JSON object with this exact structure:
{
  "userInfo": {
    "name": "extracted name or null",
    "phone": "extracted phone or null", 
    "email": "extracted email or null",
    "location": "extracted location or null",
    "company": "extracted company or null",
    "intent": "inquiry|booking|order|support or null",
    "urgency": "low|medium|high or null",
    "budget": "budget info or null",
    "preferences": ["array", "of", "preferences"] or [],
    "followUpNeeded": true/false,
    "confidence": 0-100
  },
  "shouldUpdateLead": true/false,
  "suggestedQuestions": ["array of questions to ask for missing info"],
  "leadScore": 0-100
}

LEAD SCORING (0-100):
- +20 for having name
- +20 for having phone/email
- +15 for clear intent
- +15 for urgency indicators
- +10 for location if relevant
- +10 for budget mentions
- +10 for specific requirements

CRITICAL: Only return the JSON object, no other text.`;
}

/**
 * Validates phone numbers using multiple patterns
 */
function validatePhone(phone: string): boolean {
  if (!phone) return false;

  const patterns = [
    /^\+[1-9]\d{1,14}$/, // International format
    /^\d{10,15}$/, // Basic digits
    /^\(\d{3}\)\s?\d{3}-\d{4}$/, // US format with parentheses
    /^\d{3}-\d{3}-\d{4}$/, // US format with dashes
    /^\d{3}\s\d{3}\s\d{4}$/, // US format with spaces
  ];

  return patterns.some((pattern) => pattern.test(phone.replace(/\s+/g, "")));
}

/**
 * Validates email addresses
 */
function validateEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Enhanced lead extraction using conversation analysis
 */
export async function extractLeadInformation(
  conversationId: string,
  userId: string
): Promise<LeadExtractionResult> {
  try {
    const supabase = createServiceClient();

    // Get all messages from conversation for full context analysis
    const { data: messages } = await supabase
      .from("messages")
      .select("content, sender, timestamp")
      .eq("conversation_id", conversationId)
      .order("timestamp", { ascending: true });

    if (!messages || messages.length === 0) {
      return {
        userInfo: { confidence: 0 },
        shouldUpdateLead: false,
        suggestedQuestions: [],
        leadScore: 0,
      };
    }

    // Build conversation context
    const conversationText = messages
      .map((msg) => `${msg.sender}: ${msg.content}`)
      .join("\n");

    const extractionPrompt = createExtractionPrompt();

    // Call AI for information extraction
    const completion = await extractionClient.chat.completions.create({
      model: "meta-llama/llama-4-scout:free",
      messages: [
        {
          role: "system",
          content: extractionPrompt,
        },
        {
          role: "user",
          content: `Analyze this WhatsApp conversation and extract customer information:\n\n${conversationText}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.1, // Low temperature for consistent extraction
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from extraction AI");
    }

    // Parse the JSON response
    let extractionResult: LeadExtractionResult;
    try {
      extractionResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse extraction result:", parseError);
      return {
        userInfo: { confidence: 0 },
        shouldUpdateLead: false,
        suggestedQuestions: [],
        leadScore: 0,
      };
    }

    // Validate extracted data
    if (
      extractionResult.userInfo.phone &&
      !validatePhone(extractionResult.userInfo.phone)
    ) {
      extractionResult.userInfo.phone = undefined;
      extractionResult.leadScore = Math.max(0, extractionResult.leadScore - 20);
    }

    if (
      extractionResult.userInfo.email &&
      !validateEmail(extractionResult.userInfo.email)
    ) {
      extractionResult.userInfo.email = undefined;
      extractionResult.leadScore = Math.max(0, extractionResult.leadScore - 20);
    }

    // Set confidence based on extracted data quality
    const hasName = !!extractionResult.userInfo.name;
    const hasContact = !!(
      extractionResult.userInfo.phone || extractionResult.userInfo.email
    );
    const hasIntent = !!extractionResult.userInfo.intent;

    extractionResult.userInfo.confidence =
      (hasName ? 30 : 0) + (hasContact ? 40 : 0) + (hasIntent ? 30 : 0);

    // Determine if lead should be updated
    extractionResult.shouldUpdateLead =
      extractionResult.userInfo.confidence >= 30 ||
      extractionResult.leadScore >= 40;

    return extractionResult;
  } catch (error) {
    console.error("Error in lead extraction:", error);
    return {
      userInfo: { confidence: 0 },
      shouldUpdateLead: false,
      suggestedQuestions: [],
      leadScore: 0,
    };
  }
}

/**
 * Updates lead in database with extracted information
 */
export async function updateLeadWithExtractedInfo(
  conversationId: string,
  userInfo: ExtractedUserInfo
): Promise<boolean> {
  try {
    const supabase = createServiceClient();

    // Find existing lead for this conversation
    const { data: existingLead } = await supabase
      .from("leads")
      .select("*")
      .eq("conversation_id", conversationId)
      .single();

    if (!existingLead) {
      console.log("No existing lead found for conversation:", conversationId);
      return false;
    }

    // Prepare update data
    const updateData: any = {};

    if (userInfo.name && userInfo.name !== "Unknown") {
      updateData.customer_name = userInfo.name;
    }

    if (
      userInfo.intent &&
      ["order", "booking", "inquiry"].includes(userInfo.intent)
    ) {
      updateData.type = userInfo.intent;
    }

    // Build enhanced details
    const detailsParts = [];
    if (userInfo.email) detailsParts.push(`Email: ${userInfo.email}`);
    if (userInfo.location) detailsParts.push(`Location: ${userInfo.location}`);
    if (userInfo.company) detailsParts.push(`Company: ${userInfo.company}`);
    if (userInfo.budget) detailsParts.push(`Budget: ${userInfo.budget}`);
    if (userInfo.preferences?.length)
      detailsParts.push(`Preferences: ${userInfo.preferences.join(", ")}`);
    if (userInfo.urgency) detailsParts.push(`Urgency: ${userInfo.urgency}`);

    if (detailsParts.length > 0) {
      updateData.details = detailsParts.join("\n");
    }

    // Update status if we have good information
    if (userInfo.confidence && userInfo.confidence >= 60) {
      updateData.status = "contacted";
    }

    // Only update if we have something meaningful to update
    if (Object.keys(updateData).length === 0) {
      return false;
    }

    const { error } = await supabase
      .from("leads")
      .update(updateData)
      .eq("conversation_id", conversationId);

    if (error) {
      console.error("Error updating lead:", error);
      return false;
    }

    console.log(
      `✅ Lead updated for conversation ${conversationId}:`,
      updateData
    );
    return true;
  } catch (error) {
    console.error("Error in updateLeadWithExtractedInfo:", error);
    return false;
  }
}

/**
 * Time-based lead extraction - only processes when timing conditions are met
 */
export async function processLeadExtraction(
  conversationId: string,
  userId: string,
  forceExtraction: boolean = false
): Promise<{
  success: boolean;
  extractionResult?: LeadExtractionResult;
  suggestedQuestions?: string[];
  skipped?: boolean;
  skipReason?: string;
}> {
  try {
    const supabase = createServiceClient();

    // Get conversation and its metadata
    const { data: conversation } = await supabase
      .from("conversations")
      .select("metadata, updated_at, created_at")
      .eq("id", conversationId)
      .single();

    if (!conversation) {
      return {
        success: false,
        skipped: true,
        skipReason: "Conversation not found",
      };
    }

    // Check if extraction already completed
    const extractionCompleted =
      conversation.metadata?.extractionCompleted || false;

    if (!forceExtraction && extractionCompleted) {
      return {
        success: true,
        skipped: true,
        skipReason: "Extraction already completed for this conversation",
      };
    }

    // Get conversation messages for timestamp analysis
    const { data: messages } = await supabase
      .from("messages")
      .select("content, sender, timestamp")
      .eq("conversation_id", conversationId)
      .order("timestamp", { ascending: true });

    if (!messages || messages.length === 0) {
      return {
        success: false,
        skipped: true,
        skipReason: "No messages found",
      };
    }

    if (!forceExtraction) {
      // Time-based extraction logic
      const timestamps = getConversationTimestamps(messages);
      const timeTrigger = shouldExtractByTime(
        timestamps.lastMessageTime,
        timestamps.firstMessageTime,
        extractionCompleted
      );

      if (!timeTrigger.shouldExtract) {
        return {
          success: true,
          skipped: true,
          skipReason: timeTrigger.reason,
        };
      }

      console.log(`🎯 Time-based extraction triggered: ${timeTrigger.reason}`);
    }

    // Extract information from conversation
    const extractionResult = await extractLeadInformation(
      conversationId,
      userId
    );

    // Mark extraction as completed
    await supabase
      .from("conversations")
      .update({
        status: "completed",
        metadata: {
          ...conversation.metadata,
          extractionCompleted: true,
          extractionAt: new Date().toISOString(),
        },
      })
      .eq("id", conversationId);

    // Update lead if extraction was successful and confident enough
    if (extractionResult.shouldUpdateLead) {
      const updateSuccess = await updateLeadWithExtractedInfo(
        conversationId,
        extractionResult.userInfo
      );

      if (!updateSuccess) {
        console.log("Lead extraction successful but database update failed");
      }
    }

    return {
      success: true,
      extractionResult,
      suggestedQuestions: extractionResult.suggestedQuestions,
    };
  } catch (error) {
    console.error("Error in processLeadExtraction:", error);
    return {
      success: false,
    };
  }
}
