import SettingsForm from "@/components/dashboard/settings/SettingsForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TgetSettings } from "@/app/dashboard/settings/schema";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: {user}} = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: settings, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id);
     
  
  return (
    <div className="p-4 md:p-6">
      <SettingsForm settingsData={settings as TgetSettings[]} error={error} />
    </div>
  );
}
