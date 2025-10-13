import { createServiceClient } from "@/lib/supabase/service";

export type SettingsConfig = {
  webhook?: { enabled?: boolean };
  llm?: {
    provider?: "openai";
    model?: string;
    temperature?: number;
    promptTemplateKey?: "auto" | "default" | "clinic" | "gym" | "custom";
    customPrompt?: string;
  };
  rateLimit?: {
    perNumberLimit?: number;
    globalLimit?: number;
    windowSeconds?: number;
  };
  scheduling?: { enabled?: boolean; intervalMinutes?: number };
};

const defaultSettings: Required<SettingsConfig> = {
  webhook: { enabled: true },
  llm: {
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.3,
    promptTemplateKey: "auto",
    customPrompt: "",
  },
  rateLimit: { perNumberLimit: 5, globalLimit: 30, windowSeconds: 60 * 60 },
  scheduling: { enabled: true, intervalMinutes: 10 },
};

function deepMerge<T extends Record<string, any>>(
  base: T,
  a?: Partial<T>,
  b?: Partial<T>
): T {
  const result: any = Array.isArray(base) ? [...(base as any)] : { ...base };
  const apply = (src?: Partial<T>) => {
    if (!src) return;
    for (const key of Object.keys(src)) {
      const val = (src as any)[key];
      if (val === undefined) continue;
      if (
        val &&
        typeof val === "object" &&
        !Array.isArray(val) &&
        typeof result[key] === "object" &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], val as any);
      } else {
        result[key] = val;
      }
    }
  };
  apply(a);
  apply(b);
  return result as T;
}

export async function getAppSettings(): Promise<SettingsConfig> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("app_settings")
    .select("config")
    .limit(1);

  if (error) {
    console.error("getAppSettings error:", error);
    return {};
  }

  const row = data?.[0]?.config ?? {};
  return row as SettingsConfig;
}

export async function upsertAppSettings(config: SettingsConfig) {
  const supabase = createServiceClient();
  const existing = await supabase.from("app_settings").select("id").limit(1);
  if (existing.data && existing.data.length > 0) {
    const id = existing.data[0].id;
    const { error } = await supabase
      .from("app_settings")
      .update({ config })
      .eq("id", id);
    if (error) throw error;
    return { id };
  } else {
    const { data, error } = await supabase
      .from("app_settings")
      .insert({ config })
      .select("id")
      .single();
    if (error) throw error;
    return { id: data.id };
  }
}

export async function getTenantSettings(
  tenantId: string
): Promise<SettingsConfig> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("tenant_settings")
    .select("config")
    .eq("tenant_id", tenantId)
    .single();
  if (error) {
    return {};
  }
  return (data?.config ?? {}) as SettingsConfig;
}

export async function upsertTenantSettings(
  tenantId: string,
  config: SettingsConfig
) {
  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("tenant_settings")
    .select("tenant_id")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (existing?.tenant_id) {
    const { error } = await supabase
      .from("tenant_settings")
      .update({ config })
      .eq("tenant_id", tenantId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("tenant_settings")
      .insert({ tenant_id: tenantId, config });
    if (error) throw error;
  }
}

export async function getEffectiveSettings(
  tenantId?: string
): Promise<Required<SettingsConfig>> {
  const [app, tenant] = await Promise.all([
    getAppSettings(),
    tenantId
      ? getTenantSettings(tenantId)
      : Promise.resolve({} as SettingsConfig),
  ]);
  return deepMerge(defaultSettings, app, tenant);
}
