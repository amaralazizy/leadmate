import {
  getActiveChatsCount,
  getNewMessagesCount,
  getLeadsCount,
  getConversionRate,
  getTodayMessagesCount,
  getAvgMessagesPerChat,
} from "@/actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OverviewCards() {
  try {
    const [
      activeChatsCount,
      newMessageCount,
      leadsCount,
      conversionRate,
      todayMessages,
      avgMessages,
    ] = await Promise.all([
      getActiveChatsCount(),
      getNewMessagesCount(),
      getLeadsCount(),
      getConversionRate(),
      getTodayMessagesCount(),
      getAvgMessagesPerChat(),
    ]);

    const stats = [
      { label: "Active Chats", value: activeChatsCount, icon: "💬" },
      { label: "Total Leads", value: leadsCount, icon: "🎯" },
      { label: "Conversion Rate", value: conversionRate, icon: "📈" },
      { label: "New Messages", value: newMessageCount, icon: "🔔" },
      { label: "Today's Messages", value: todayMessages, icon: "📅" },
      { label: "Avg Msg/Chat", value: avgMessages, icon: "⚡" },
    ];

    return (
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="rounded-base border p-3 sm:p-4 lg:p-5 hover:shadow-lg hover:scale-105 transition-all duration-200 bg-gradient-to-br from-background to-secondary-background/30"
            >
              <CardHeader className="flex items-center justify-between px-0 pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {s.label}
                </CardTitle>
                <span className="text-xl sm:text-2xl flex-shrink-0">
                  {s.icon}
                </span>
              </CardHeader>
              <p className="text-xl sm:text-2xl lg:text-3xl font-heading text-foreground">
                {s.value}
              </p>
            </Card>
          ))}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Failed to load overview data:", error);

    // Fallback stats when data loading fails
    const fallbackStats = [
      { label: "Active Chats", value: "-", icon: "💬" },
      { label: "Total Leads", value: "-", icon: "🎯" },
      { label: "Conversion Rate", value: "-", icon: "📈" },
      { label: "New Messages", value: "-", icon: "🔔" },
      { label: "Today's Messages", value: "-", icon: "📅" },
      { label: "Avg Msg/Chat", value: "-", icon: "⚡" },
    ];

    return (
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {fallbackStats.map((s) => (
            <div
              key={s.label}
              className="rounded-base border p-3 sm:p-4 lg:p-5 opacity-75 bg-gradient-to-br from-background to-secondary-background/20"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                  {s.label}
                </p>
                <span className="text-xl sm:text-2xl opacity-50 flex-shrink-0">
                  {s.icon}
                </span>
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-heading text-muted-foreground">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
}
