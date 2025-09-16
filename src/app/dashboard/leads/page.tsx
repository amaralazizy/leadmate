import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LeadsTable from "@/components/dashboard/leads/LeadsTable";

export default async function LeadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch leads for the user
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching leads:", error);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          Leads
        </h1>
        <p className="text-xs sm:text-sm text-foreground/60 mt-1 sm:mt-2">
          Manage and export your captured leads
        </p>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  );
}
