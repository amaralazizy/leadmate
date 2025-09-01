export interface User {
  id: string;
  email: string;
  business_name: string;
  business_type?: string;
  whatsapp_number?: string;
  business_industry?: string;
  business_logo_url?: string;
  subscription_status: 'trial' | 'active' | 'cancelled';
  usage_count: number;
  usage_limit: number;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}
