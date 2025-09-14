import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear existing knowledge base for this user
    await supabase.from("knowledge_base").delete().eq("user_id", user.id);

    // Store the content as-is in database
    await supabase.from("knowledge_base").insert({
      user_id: user.id,
      content: content,
      metadata: {
        length: content.length,
        words: content.split(" ").length,
      },
    });

    return NextResponse.json({
      message: "Knowledge base updated successfully",
    });
  } catch (error) {
    console.error("Knowledge API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get current user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's knowledge base
    const { data: knowledge, error } = await supabase
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
