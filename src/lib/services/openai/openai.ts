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
