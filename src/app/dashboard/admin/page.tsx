import { requireAdmin } from "@/lib/auth/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlobalSettingsForm from "@/components/dashboard/admin/GlobalSettingsForm";
import TenantSettingsPanel from "@/components/dashboard/admin/TenantSettingsPanel";
import RateLimitPanel from "@/components/dashboard/admin/RateLimitPanel";
import SchedulingPanel from "@/components/dashboard/admin/SchedulingPanel";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <Tabs defaultValue="global" className="w-full">
        <TabsList>
          <TabsTrigger value="global">Global Settings</TabsTrigger>
          <TabsTrigger value="tenant">Tenant Settings</TabsTrigger>
          <TabsTrigger value="rate">Rate Limits</TabsTrigger>
          <TabsTrigger value="sched">Scheduling</TabsTrigger>
        </TabsList>
        <TabsContent value="global">
          <GlobalSettingsForm />
        </TabsContent>
        <TabsContent value="tenant">
          <TenantSettingsPanel />
        </TabsContent>
        <TabsContent value="rate">
          <RateLimitPanel />
        </TabsContent>
        <TabsContent value="sched">
          <SchedulingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
