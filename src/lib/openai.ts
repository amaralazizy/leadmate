import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

export async function generateChatResponse(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  context?: string
): Promise<string> {
  const systemPrompt = `You are a helpful assistant for a business.

${context ? `Use this business information to help customers: ${context}` : ""}

When customers want to order/book:
1. Help them naturally using the provided business information
2. Ask for name and phone when they're ready
3. Confirm details clearly
4. End with: [LEAD: {type: "order/booking/inquiry", details: "...", customer: {name: "...", phone: "..."}}]

Keep responses under 160 characters when possible.
If unsure, say "Let me connect you with someone who can help."`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_tokens: 200,
    temperature: 0.7,
  });

  return (
    response.choices[0]?.message?.content ||
    "I apologize, but I cannot respond right now. Please try again."
  );
}

export function extractLead(response: string): {
  type: string;
  details: string;
  customer: { name: string; phone: string };
} | null {
  const leadMatch = response.match(/\[LEAD:\s*({.*?})\]/);
  if (!leadMatch) return null;

  try {
    return JSON.parse(leadMatch[1]);
  } catch {
    return null;
  }
}
