import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase/client";
import { generateEmbedding } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
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

    // Split content into chunks (simple implementation)
    const chunks = content
      .split("\n\n")
      .filter((chunk) => chunk.trim().length > 0)
      .map((chunk) => chunk.trim());

    // Clear existing knowledge base for this user
    await supabaseAdmin.from("knowledge_base").delete().eq("user_id", user.id);

    // Process each chunk
    for (const chunk of chunks) {
      if (chunk.length < 10) continue; // Skip very short chunks

      try {
        // Generate embedding
        const embedding = await generateEmbedding(chunk);

        // Store in database
        await supabaseAdmin.from("knowledge_base").insert({
          user_id: user.id,
          content: chunk,
          embedding: embedding,
          metadata: {
            length: chunk.length,
            words: chunk.split(" ").length,
          },
        });
      } catch (error) {
        console.error("Error processing chunk:", error);
        // Continue with other chunks even if one fails
      }
    }

    return NextResponse.json({
      message: "Knowledge base updated successfully",
      chunks_processed: chunks.length,
    });
  } catch (error) {
    console.error("Knowledge API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's knowledge base
    const { data: knowledge, error } = await supabaseAdmin
      .from("knowledge_base")
      .select("id, content, metadata, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ knowledge });
  } catch (error) {
    console.error("Knowledge GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
