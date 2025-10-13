import { NextRequest, NextResponse } from "next/server";
import { scheduledLeadProcessing } from "@/lib/services/leads";
import { getEffectiveSettings } from "@/lib/services/settings";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Batch processing endpoint for abandoned conversations
 * Call this from a cron job or similar scheduling system
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Add API key authentication
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.BATCH_PROCESSING_TOKEN;

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Optional tenant scoping via query string
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || undefined;

    // When tenantId provided, ensure it exists
    if (tenantId) {
      const supabase = createServiceClient();
      const { data: tenant, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", tenantId)
        .single();
      if (error || !tenant) {
        return NextResponse.json(
          { error: "Tenant not found" },
          { status: 404 }
        );
      }
    }

    const settings = await getEffectiveSettings(tenantId);
    if (!settings.scheduling.enabled) {
      return NextResponse.json(
        { success: false, error: "Scheduling disabled" },
        { status: 403 }
      );
    }

    console.log("🔄 Starting batch lead processing from API endpoint");

    // Process abandoned and ended conversations
    await scheduledLeadProcessing();

    return NextResponse.json(
      {
        success: true,
        message: "Batch processing completed",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in batch processing endpoint:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Batch processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Lead Batch Processing",
    timestamp: new Date().toISOString(),
  });
}
