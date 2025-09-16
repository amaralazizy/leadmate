import OverviewCards from "@/components/dashboard/home/OverviewCards";
// import RecentActivity from "@/components/dashboard/home/RecentActivity";
import { AnalyticsContainer } from "@/components/dashboard/analytics";
// import QuickActions from "@/components/dashboard/home/QuickActions";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-sm sm:text-base text-foreground/60 mt-1 sm:mt-2">
          Monitor your WhatsApp bot performance and customer engagement
        </p>
      </div>

      {/* Overview Cards */}
      <OverviewCards />

      {/* Analytics Section */}
      <AnalyticsContainer />

      {/* <QuickActions /> */}
      {/* <RecentActivity /> */}
    </div>
  );
}
