import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/services/analytics";
import { timePeriodSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodParam = searchParams.get("period") || "month";

    // Validate period parameter using Zod
    const periodValidation = timePeriodSchema.safeParse(periodParam);
    if (!periodValidation.success) {
      return NextResponse.json(
        {
          error: "Invalid period parameter. Must be 'day', 'month', or 'year'",
        },
        { status: 400 }
      );
    }

    const period = periodValidation.data;

    const analyticsData = await getAnalyticsData(period);

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Analytics API error:", error);

    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
