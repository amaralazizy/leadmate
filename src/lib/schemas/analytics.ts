import { z } from "zod";

export const timePeriodSchema = z.enum(["day", "month", "year"]);

export const timeSeriesDataSchema = z.object({
  date: z.string(),
  value: z.number(),
  label: z.string(),
});

export const messagesChartDataSchema = z.object({
  date: z.string(),
  customer: z.number().int().min(0),
  bot: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const leadsChartDataSchema = z.object({
  date: z.string(),
  order: z.number().int().min(0),
  booking: z.number().int().min(0),
  inquiry: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const conversationsChartDataSchema = z.object({
  date: z.string(),
  active: z.number().int().min(0),
  completed: z.number().int().min(0),
  archived: z.number().int().min(0),
  total: z.number().int().min(0),
});

export const metricsChartDataSchema = z.object({
  date: z.string(),
  conversionRate: z.number().min(0).max(100),
  responseTime: z.number().min(0),
  leadQuality: z.number().min(0).max(100),
});

export const analyticsDataSchema = z.object({
  messages: z.array(messagesChartDataSchema),
  leads: z.array(leadsChartDataSchema),
  conversations: z.array(conversationsChartDataSchema),
  metrics: z.array(metricsChartDataSchema),
});

// Inferred types
export type TimePeriod = z.infer<typeof timePeriodSchema>;
export type TimeSeriesData = z.infer<typeof timeSeriesDataSchema>;
export type MessagesChartData = z.infer<typeof messagesChartDataSchema>;
export type LeadsChartData = z.infer<typeof leadsChartDataSchema>;
export type ConversationsChartData = z.infer<
  typeof conversationsChartDataSchema
>;
export type MetricsChartData = z.infer<typeof metricsChartDataSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;
