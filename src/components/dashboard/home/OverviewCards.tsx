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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s) => (
            <Card
              key={s.label}
              className="rounded-base border p-4 hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex items-center justify-between px-0">
                <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
                <span className="text-2xl">{s.icon}</span>
              </CardHeader>
              <p className="text-2xl font-heading">{s.value}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {fallbackStats.map((s) => (
            <div key={s.label} className="rounded-base border p-4 opacity-75">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <span className="text-lg opacity-50">{s.icon}</span>
              </div>
              <p className="text-2xl font-heading text-muted-foreground">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }
}
