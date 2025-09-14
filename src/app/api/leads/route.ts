import { createClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils/utils";
import { NextResponse, NextRequest } from "next/server";
import { leadSchema } from "@/lib/schemas/lead";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get user from session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { data: leads, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ leads: leads || [] });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Required fields for atomic lead+conversation creation
    const { customer_phone, customer_name, type, details, status } = body;

    if (!customer_phone || !customer_name || !type) {
      return NextResponse.json(
        { error: "customer_phone, customer_name, and type are required" },
        { status: 400 }
      );
    }

    // Validate the data using schemas before sending to RPC
    const leadData = leadSchema
      .omit({
        id: true,
        created_at: true,
        user_id: true,
        conversation_id: true,
      })
      .parse({
        customer_phone,
        customer_name,
        type,
        details: details || null,
        status: status || "new",
      });

    // Always use atomic transaction for lead+conversation creation
    const { data: result, error: rpcError } = await supabase.rpc(
      "create_lead_with_conversation",
      {
        p_user_id: user.id,
        p_customer_phone: leadData.customer_phone,
        p_customer_name: leadData.customer_name,
        p_lead_type: leadData.type,
        p_details: leadData.details,
        p_conversation_status: "active",
        p_lead_status: leadData.status,
      }
    );

    if (rpcError) {
      throw rpcError;
    }

    // Check if the RPC function returned an error
    if (!result?.success) {
      throw new Error(
        result?.error || "Failed to create lead and conversation"
      );
    }

    return NextResponse.json({
      message: "Lead and conversation created successfully",
      success: true,
      data: {
        lead_id: result.lead_id,
        conversation_id: result.conversation_id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
