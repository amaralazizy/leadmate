import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/services/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();


    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      business_name,
      business_type,
      business_logo_url,
    } = body;

    // Update user business information
    const { data, error } = await supabase
      .from("users")
      .update({
        business_name,
        business_type,
        business_logo_url,
      })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update business information" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Business info update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
