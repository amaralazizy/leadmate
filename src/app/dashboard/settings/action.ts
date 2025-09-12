"use server";
import { TSettingsInput } from "@/app/dashboard/settings/schema";
import { TSettingsFormPrevState } from "@/app/dashboard/settings/schema";
import { SettingsInputSchema } from "@/app/dashboard/settings/schema";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(
  prevState: TSettingsFormPrevState,
  formData: FormData
): Promise<TSettingsFormPrevState> {
  const raw = {
    business_name: String(formData.get("business_name") || ""),
    business_type: String(formData.get("business_type") || ""),
    business_logo_url: String(formData.get("business_logo_url") || ""),
    whatsapp_number: String(formData.get("whatsapp_number") || ""),
    subscription_status: String(formData.get("subscription_status") || "trial"),
    usage_count: Number(formData.get("usage_count") || 0),
    usage_limit: Number(formData.get("usage_limit") || 500),
    stripe_customer_id: String(formData.get("stripe_customer_id") || ""),
  } satisfies TSettingsInput;

  const parsed = SettingsInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: TSettingsFormPrevState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof TSettingsInput;
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return { success: false, errors: fieldErrors, inputs: raw };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return {
      success: false,
      errors: { supabase: ["Not authenticated"] },
      inputs: raw,
    };
  }

  const { error } = await supabase
    .from("users")
    .update(parsed.data)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return {
      success: false,
      errors: { supabase: [error.message] },
      inputs: parsed.data,
    };
  }

  revalidatePath("/dashboard/settings");

  return { success: true, inputs: parsed.data };
}
