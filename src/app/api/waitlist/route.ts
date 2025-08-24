import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingEmail } = await supabaseAdmin
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Store email in waitlist table
    const { error } = await supabaseAdmin.from("waitlist").insert(email);

    if (error) {
      console.error("Waitlist storage error:", error);
      return NextResponse.json(
        { error: "Failed to store email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Successfully joined waitlist",
      email: email,
    });
  } catch (error) {
    console.error("Waitlist API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get waitlist count
    const { count, error } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error("Waitlist count error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
