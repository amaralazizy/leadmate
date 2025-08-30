import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export interface UserSettings {
  id: string;
  email: string;
  business_name: string;
  business_type: string;
  whatsapp_number: string;
  business_industry: string;
  business_logo_url: string;
  twilio_phone_sid: string;
  twilio_phone_number: string;
  twilio_sender_sid: string;
  twilio_waba_id: string;
  whatsapp_status: string;
  subscription_status: "trial" | "active" | "cancelled";
  usage_count: number;
  usage_limit: number;
  stripe_customer_id: string;
  created_at: string;
  updated_at: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch user settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const { data } = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  // Update user settings
  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update settings");
      }

      const { data } = await response.json();
      setSettings(data);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update settings";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    saving,
    fetchSettings,
    updateSettings,
  };
}
