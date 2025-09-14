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
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading text-foreground">Leads</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Manage and export your captured leads
          </p>
        </div>
      </div>

      <LeadsTable leads={leads || []} />
    </div>
  );
}
