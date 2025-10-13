import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET() {
  try {
    await requireAdmin();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    const token = process.env.BATCH_PROCESSING_TOKEN || "";
    const safeTokenSuffix = token ? token.slice(0, 4) + "…" : "";

    const cronUrl = baseUrl
      ? `${baseUrl}/api/leads/batch-process`
      : "/api/leads/batch-process";

    return NextResponse.json({
      success: true,
      data: {
        cronUrl,
        authHeaderExample: token
          ? `Authorization: Bearer ${safeTokenSuffix}`
          : null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
