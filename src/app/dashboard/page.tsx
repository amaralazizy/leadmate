import OverviewCards from "@/components/dashboard/home/OverviewCards";
// import RecentActivity from "@/components/dashboard/home/RecentActivity";
import { AnalyticsContainer } from "@/components/dashboard/analytics";
// import QuickActions from "@/components/dashboard/home/QuickActions";

export default async function DashboardHomePage() {
  return (
    <div className="p-4 md:p-6 space-y-8">
      <OverviewCards />

      {/* Analytics Section */}
      <AnalyticsContainer />

      {/* <QuickActions /> */}
      {/* <RecentActivity /> */}
    </div>
  );
}
