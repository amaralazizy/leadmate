import { supabase } from "@/lib/services/supabase/client";
import { getErrorMessage } from "@/lib/utils/utils";
import { NextResponse, NextRequest } from "next/server";
import { leadSchema } from "@/lib/schemas/lead";
import { conversationSchema } from "@/lib/schemas/conversation";

// type User = z.infer<typeof userSchema>;

export async function GET() {
  try {
    const { data: users, error } = await supabase.from("leads").select("*");

    console.log("Users:", users, "Error:", error);

    if (users && users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    if (error) {
      throw error;
    }

    return NextResponse.json({ users });
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
