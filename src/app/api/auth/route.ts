import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const body = await request.json();
    const {
      business_name,
      business_type,
      whatsapp_number,
      business_industry,
      business_logo_url,
    } = body;

    // Validate required fields
    if (!business_name) {
      return NextResponse.json(
        { error: "Business name is required" },
        { status: 400 }
      );
    }

    // Update user settings
    const { data, error } = await supabase
      .from("users")
      .update({
        business_name,
        business_type,
        whatsapp_number,
        business_industry,
        business_logo_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user settings:", error);
      return NextResponse.json(
        { error: "Failed to update settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Error in settings update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the current user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user settings
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id);

    if (error) {
      console.error("Error fetching user settings:", error);
      return NextResponse.json(
        { error: "Failed to fetch settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in settings fetch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
