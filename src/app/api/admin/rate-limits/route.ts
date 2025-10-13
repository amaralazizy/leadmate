import { NextRequest, NextResponse } from "next/server";
import {
  getWhatsAppRateLimitStatus,
  resetWhatsAppRateLimit,
  getWhatsAppRateLimitStatistics,
  testRedisConnection,
} from "@/lib/services/redisRateLimiting";
import { requireAdmin } from "@/lib/auth/admin";

// GET - Check rate limit status, get statistics, or test connection
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const targetNumber = searchParams.get("targetNumber");
    const fromNumber = searchParams.get("fromNumber");
    const action = searchParams.get("action"); // 'status', 'stats', or 'test'

    // Test Redis connection
    if (action === "test") {
      const testResult = await testRedisConnection();
      return NextResponse.json({
        success: testResult.success,
        message: testResult.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (!targetNumber) {
      return NextResponse.json(
        { error: "targetNumber is required" },
        { status: 400 }
      );
    }

    if (action === "stats") {
      // Get detailed statistics for the target number
      const stats = await getWhatsAppRateLimitStatistics(targetNumber);

      return NextResponse.json({
        success: true,
        data: {
          targetNumber,
          ...stats,
          resetTimeFormatted: new Date(stats.resetTime).toISOString(),
        },
      });
    } else {
      // Get status for specific from number
      if (!fromNumber) {
        return NextResponse.json(
          { error: "fromNumber is required for status check" },
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
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST - Reset rate limits
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
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
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE - Reset all rate limits for a target number
export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();
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
    const message = error instanceof Error ? error.message : "Failed";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
