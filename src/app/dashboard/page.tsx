import OverviewCards from "@/components/dashboard/home/OverviewCards";
import RecentActivity from "@/components/dashboard/home/RecentActivity";
// import QuickActions from "@/components/dashboard/home/QuickActions";

export default async function DashboardHomePage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <OverviewCards />
      {/* <QuickActions /> */}
      <RecentActivity />
    </div>
  );
}
