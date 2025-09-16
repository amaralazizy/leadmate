import SettingsForm from "@/components/dashboard/settings/SettingsForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TgetSettings } from "@/app/dashboard/settings/schema";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: settings, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-1 sm:mt-2">
          Manage your account settings and preferences
        </p>
      </div>
      <SettingsForm settingsData={settings as TgetSettings[]} error={error} />
    </div>
  );
}
