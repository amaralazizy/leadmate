import { NextRequest, NextResponse } from "next/server";
import { scheduledLeadProcessing } from "@/lib/services/leads";

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
