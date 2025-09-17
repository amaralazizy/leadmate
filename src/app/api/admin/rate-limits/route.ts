import { NextRequest, NextResponse } from "next/server";
import {
  getWhatsAppRateLimitStatus,
  resetWhatsAppRateLimit,
} from "@/lib/services/rateLimiting";

// GET - Check rate limit status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetNumber = searchParams.get("targetNumber");
    const fromNumber = searchParams.get("fromNumber");

    if (!targetNumber || !fromNumber) {
      return NextResponse.json(
        { error: "targetNumber and fromNumber are required" },
        { status: 400 }
      );
    }

    const status = await getWhatsAppRateLimitStatus(targetNumber, fromNumber);

    return NextResponse.json({
      success: true,
      data: {
        targetNumber,
        fromNumber,
        ...status,
        resetTimeFormatted: new Date(status.resetTime).toISOString(),
      },
    });
  } catch (error) {
    console.error("Rate limit status check error:", error);
    return NextResponse.json(
      { error: "Failed to check rate limit status" },
      { status: 500 }
    );
  }
}

// POST - Reset rate limits
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetNumber, fromNumber } = body;

    if (!targetNumber) {
      return NextResponse.json(
        { error: "targetNumber is required" },
        { status: 400 }
      );
    }

    const result = await resetWhatsAppRateLimit(targetNumber, fromNumber);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        targetNumber,
        fromNumber: fromNumber || "all",
        resetAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Rate limit reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset rate limits" },
      { status: 500 }
    );
  }
}

// DELETE - Reset all rate limits for a target number
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetNumber = searchParams.get("targetNumber");

    if (!targetNumber) {
      return NextResponse.json(
        { error: "targetNumber is required" },
        { status: 400 }
      );
    }

    const result = await resetWhatsAppRateLimit(targetNumber);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        targetNumber,
        scope: "all senders",
        resetAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Rate limit bulk reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset all rate limits" },
      { status: 500 }
    );
  }
}
