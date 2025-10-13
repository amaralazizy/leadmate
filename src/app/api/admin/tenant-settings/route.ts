import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import {
  getTenantSettings,
  upsertTenantSettings,
  SettingsConfig,
} from "@/lib/services/settings";
import { createServiceClient } from "@/lib/supabase/service";

// GET supports two modes:
// 1) List tenants minimal info (when no tenantId provided)
// 2) Get settings for a specific tenant (when tenantId provided)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const q = searchParams.get("q")?.toLowerCase();

    if (tenantId) {
      const config = await getTenantSettings(tenantId);
      return NextResponse.json({ success: true, data: config });
    }

    const supabase = createServiceClient();
    let query = supabase
      .from("users")
      .select("id, email, business_name, whatsapp_number")
      .limit(50);

    if (q) {
      query = query.or(
        `email.ilike.%${q}%,business_name.ilike.%${q}%,whatsapp_number.ilike.%${q}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// PUT updates a specific tenant's settings overrides
export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    const body = (await request.json()) as {
      tenantId: string;
      config: SettingsConfig;
    };
    if (!body?.tenantId) {
      return NextResponse.json(
        { success: false, error: "tenantId is required" },
        { status: 400 }
      );
    }
    await upsertTenantSettings(body.tenantId, body.config || {});
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update";
    const status = message === "Admin only" ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
