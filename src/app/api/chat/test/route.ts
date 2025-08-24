import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";
import { generateChatResponse, generateEmbedding } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's knowledge base using vector similarity search
    let context = "";
    try {
      // Generate embedding for the user's message
      const queryEmbedding = await generateEmbedding(message);

      // Search for similar content in knowledge base
      const { data: knowledge } = await supabaseAdmin.rpc("match_knowledge", {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 3,
        user_id: user.id,
      });

      if (knowledge && knowledge.length > 0) {
        context = knowledge
          .map((k: { content: string }) => k.content)
          .join("\n");
      }
    } catch (error) {
      console.error("Vector search error:", error);

      // Fallback: get recent knowledge base entries
      const { data: fallbackKnowledge } = await supabaseAdmin
        .from("knowledge_base")
        .select("content")
        .eq("user_id", user.id)
        .limit(3);

      if (fallbackKnowledge) {
        context = fallbackKnowledge.map((k) => k.content).join("\n");
      }
    }

    // Generate AI response
    const response = await generateChatResponse(
      [{ role: "user", content: message }],
      context
    );

    // Clean response (remove lead markers for test)
    const cleanResponse = response.replace(/\[LEAD:.*?\]/g, "").trim();

    return NextResponse.json({
      response: cleanResponse,
      context_used: !!context,
    });
  } catch (error) {
    console.error("Chat test error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
