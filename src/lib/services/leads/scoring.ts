import { ExtractedUserInfo } from "./extraction";

/**
 * Advanced lead scoring algorithms
 */
export interface LeadScoringWeights {
  hasName: number;
  hasPhone: number;
  hasEmail: number;
  hasLocation: number;
  hasCompany: number;
  intentOrder: number;
  intentBooking: number;
  intentInquiry: number;
  urgencyHigh: number;
  urgencyMedium: number;
  hasBudget: number;
  hasPreferences: number;
  responseSpeed: number;
  messageLength: number;
}

/**
 * Default scoring weights for lead qualification
 */
export const DEFAULT_SCORING_WEIGHTS: LeadScoringWeights = {
  hasName: 15,
  hasPhone: 20,
  hasEmail: 15,
  hasLocation: 8,
  hasCompany: 7,
  intentOrder: 20,
  intentBooking: 15,
  intentInquiry: 10,
  urgencyHigh: 15,
  urgencyMedium: 8,
  hasBudget: 12,
  hasPreferences: 8,
  responseSpeed: 5,
  messageLength: 3,
};

/**
 * Calculate lead score based on extracted information
 */
export function calculateLeadScore(
  userInfo: ExtractedUserInfo,
  weights: LeadScoringWeights = DEFAULT_SCORING_WEIGHTS
): number {
  let score = 0;

  // Contact information scoring
  if (userInfo.name) score += weights.hasName;
  if (userInfo.phone) score += weights.hasPhone;
  if (userInfo.email) score += weights.hasEmail;
  if (userInfo.location) score += weights.hasLocation;
  if (userInfo.company) score += weights.hasCompany;

  // Intent scoring
  if (userInfo.intent === "order") score += weights.intentOrder;
  else if (userInfo.intent === "booking") score += weights.intentBooking;
  else if (userInfo.intent === "inquiry") score += weights.intentInquiry;

  // Urgency scoring
  if (userInfo.urgency === "high") score += weights.urgencyHigh;
  else if (userInfo.urgency === "medium") score += weights.urgencyMedium;

  // Additional information scoring
  if (userInfo.budget) score += weights.hasBudget;
  if (userInfo.preferences && userInfo.preferences.length > 0) {
    score += weights.hasPreferences;
  }

  // Cap at 100
  return Math.min(100, score);
}

/**
 * Categorize leads based on score
 */
export function categorizeLead(score: number): "hot" | "warm" | "cold" {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

/**
 * Get priority actions based on lead score and information
 */
export function getLeadPriorities(
  userInfo: ExtractedUserInfo,
  score: number
): string[] {
  const priorities: string[] = [];
  const category = categorizeLead(score);

  if (category === "hot") {
    priorities.push("Immediate follow-up required");
    if (userInfo.phone) {
      priorities.push("Schedule phone call within 2 hours");
    } else {
      priorities.push("Request phone number urgently");
    }
  }

  if (category === "warm") {
    priorities.push("Follow up within 24 hours");
    if (!userInfo.email && !userInfo.phone) {
      priorities.push("Collect contact information");
    }
  }

  if (!userInfo.name) {
    priorities.push("Get customer name");
  }

  if (!userInfo.phone && !userInfo.email) {
    priorities.push("Collect contact information");
  }

  if (userInfo.intent === "order" && !userInfo.budget) {
    priorities.push("Discuss budget and pricing");
  }

  if (userInfo.urgency === "high") {
    priorities.push("Express handling - urgent customer need");
  }

  return priorities;
}

/**
 * Generate follow-up questions based on missing information
 */
export function generateFollowUpQuestions(
  userInfo: ExtractedUserInfo
): string[] {
  const questions: string[] = [];

  if (!userInfo.name) {
    questions.push("What should I call you?");
    questions.push("May I have your name for our records?");
  }

  if (!userInfo.phone && !userInfo.email) {
    questions.push("What's the best way to reach you with updates?");
    questions.push(
      "Would you like me to send you more details? What's your email?"
    );
    questions.push("Should I have someone call you to discuss this further?");
  }

  if (userInfo.intent === "inquiry" && !userInfo.urgency) {
    questions.push("What timeline are you working with?");
    questions.push(
      "Is this something you need soon or are you planning ahead?"
    );
  }

  if (userInfo.intent === "order" && !userInfo.budget) {
    questions.push("Do you have a budget range in mind?");
    questions.push("What investment level are you comfortable with?");
  }

  if (!userInfo.location) {
    questions.push("Which area are you located in?");
    questions.push("Where would you like this service/product delivered?");
  }

  return questions;
}

/**
 * Analyze conversation quality and engagement
 */
export function analyzeConversationQuality(
  messages: Array<{ content: string; sender: string }>
): {
  responseRate: number;
  avgMessageLength: number;
  engagementScore: number;
  questionCount: number;
} {
  const customerMessages = messages.filter((m) => m.sender === "customer");
  const totalMessages = messages.length;

  if (customerMessages.length === 0) {
    return {
      responseRate: 0,
      avgMessageLength: 0,
      engagementScore: 0,
      questionCount: 0,
    };
  }

  const responseRate = customerMessages.length / totalMessages;
  const avgMessageLength =
    customerMessages.reduce((sum, msg) => sum + msg.content.length, 0) /
    customerMessages.length;

  // Count questions asked by customer (indicates engagement)
  const questionCount = customerMessages.reduce(
    (count, msg) => count + (msg.content.includes("?") ? 1 : 0),
    0
  );

  // Simple engagement scoring based on message length and questions
  let engagementScore = 0;
  if (avgMessageLength > 50) engagementScore += 25;
  if (avgMessageLength > 100) engagementScore += 15;
  if (questionCount > 0) engagementScore += 30;
  if (questionCount > 2) engagementScore += 20;
  if (responseRate > 0.4) engagementScore += 10;

  return {
    responseRate,
    avgMessageLength,
    engagementScore: Math.min(100, engagementScore),
    questionCount,
  };
}
