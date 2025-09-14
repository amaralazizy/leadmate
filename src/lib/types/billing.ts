export interface Subscription {
  id: string;
  customer_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: number;
  current_period_end: number;
  plan_id: string;
  usage_count: number;
  usage_limit: number;
}

export interface BillingHistory {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  invoice_url: string;
  created: number;
}

export interface UsageData {
  current_usage: number;
  usage_limit: number;
  usage_percentage: number;
  reset_date: string;
}

export type PlanId = 'STARTER' | 'PRO' | 'ENTERPRISE';
