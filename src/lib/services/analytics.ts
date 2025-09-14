import { createClient } from "@/lib/supabase/server";
import {
  analyticsDataSchema,
  type TimePeriod,
  type AnalyticsData,
  type MessagesChartData,
  type LeadsChartData,
  type ConversationsChartData,
} from "@/lib/schemas";

export async function getAnalyticsData(
  period: TimePeriod
): Promise<AnalyticsData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const [messages, leads, conversations] = await Promise.all([
    getMessagesAnalytics(user.id, period),
    getLeadsAnalytics(user.id, period),
    getConversationsAnalytics(user.id, period),
  ]);

  const analyticsData = {
    messages,
    leads,
    conversations,
    metrics: [], // Will implement later
  };

  // Validate the data structure before returning
  const validatedData = analyticsDataSchema.parse(analyticsData);
  return validatedData;
}

export async function getMessagesAnalytics(
  userId: string,
  period: TimePeriod
): Promise<MessagesChartData[]> {
  const supabase = await createClient();
  const dateRange = getDateRange(period);

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      timestamp,
      sender,
      conversations!inner (
        user_id
      )
    `
    )
    .eq("conversations.user_id", userId)
    .gte("timestamp", dateRange.start)
    .lte("timestamp", dateRange.end)
    .order("timestamp", { ascending: true });

  if (error) throw error;

  return aggregateMessagesByPeriod(data || [], period);
}

export async function getLeadsAnalytics(
  userId: string,
  period: TimePeriod
): Promise<LeadsChartData[]> {
  const supabase = await createClient();
  const dateRange = getDateRange(period);

  const { data, error } = await supabase
    .from("leads")
    .select("created_at, type")
    .eq("user_id", userId)
    .gte("created_at", dateRange.start)
    .lte("created_at", dateRange.end)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return aggregateLeadsByPeriod(data || [], period);
}

export async function getConversationsAnalytics(
  userId: string,
  period: TimePeriod
): Promise<ConversationsChartData[]> {
  const supabase = await createClient();
  const dateRange = getDateRange(period);

  const { data, error } = await supabase
    .from("conversations")
    .select("created_at, status")
    .eq("user_id", userId)
    .gte("created_at", dateRange.start)
    .lte("created_at", dateRange.end)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return aggregateConversationsByPeriod(data || [], period);
}

function getDateRange(period: TimePeriod): { start: string; end: string } {
  const now = new Date();
  const end = now.toISOString();

  let start: Date;

  switch (period) {
    case "day":
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      start = new Date(now);
      start.setDate(start.getDate() - 30);
  }

  return {
    start: start.toISOString(),
    end,
  };
}

function aggregateMessagesByPeriod(
  data: Array<{ timestamp: string; sender: string }>,
  period: TimePeriod
): MessagesChartData[] {
  const grouped = new Map<string, { customer: number; bot: number }>();

  data.forEach((item) => {
    const key = formatDateKey(item.timestamp, period);
    const current = grouped.get(key) || { customer: 0, bot: 0 };

    if (item.sender === "customer") {
      current.customer++;
    } else if (item.sender === "bot") {
      current.bot++;
    }

    grouped.set(key, current);
  });

  return Array.from(grouped.entries()).map(([date, counts]) => ({
    date,
    customer: counts.customer,
    bot: counts.bot,
    total: counts.customer + counts.bot,
  }));
}

function aggregateLeadsByPeriod(
  data: Array<{ created_at: string; type: string }>,
  period: TimePeriod
): LeadsChartData[] {
  const grouped = new Map<
    string,
    { order: number; booking: number; inquiry: number }
  >();

  data.forEach((item) => {
    const key = formatDateKey(item.created_at, period);
    const current = grouped.get(key) || { order: 0, booking: 0, inquiry: 0 };

    if (item.type === "order") {
      current.order++;
    } else if (item.type === "booking") {
      current.booking++;
    } else if (item.type === "inquiry") {
      current.inquiry++;
    }

    grouped.set(key, current);
  });

  return Array.from(grouped.entries()).map(([date, counts]) => ({
    date,
    order: counts.order,
    booking: counts.booking,
    inquiry: counts.inquiry,
    total: counts.order + counts.booking + counts.inquiry,
  }));
}

function aggregateConversationsByPeriod(
  data: Array<{ created_at: string; status: string }>,
  period: TimePeriod
): ConversationsChartData[] {
  const grouped = new Map<
    string,
    { active: number; completed: number; archived: number }
  >();

  data.forEach((item) => {
    const key = formatDateKey(item.created_at, period);
    const current = grouped.get(key) || {
      active: 0,
      completed: 0,
      archived: 0,
    };

    if (item.status === "active") {
      current.active++;
    } else if (item.status === "completed") {
      current.completed++;
    } else if (item.status === "archived") {
      current.archived++;
    }

    grouped.set(key, current);
  });

  return Array.from(grouped.entries()).map(([date, counts]) => ({
    date,
    active: counts.active,
    completed: counts.completed,
    archived: counts.archived,
    total: counts.active + counts.completed + counts.archived,
  }));
}

function formatDateKey(timestamp: string, period: TimePeriod): string {
  const date = new Date(timestamp);

  switch (period) {
    case "day":
      return `${date.getHours()}:00`;
    case "month":
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    case "year":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`; // YYYY-MM
    default:
      return date.toISOString().split("T")[0];
  }
}
