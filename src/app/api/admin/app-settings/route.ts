import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getAppSettings,
  upsertAppSettings,
  SettingsConfig,
} from "@/lib/services/settings";

export async function GET() {
  try {
    await requireAdmin();
    const config = await getAppSettings();
    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as SettingsConfig;
    await upsertAppSettings(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
