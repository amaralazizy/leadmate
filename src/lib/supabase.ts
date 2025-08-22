import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Database types
export interface User {
  id: string;
  email: string;
  business_name: string;
  business_type: string;
  whatsapp_number: string;
  subscription_status: "trial" | "active" | "cancelled";
  usage_count: number;
  usage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBase {
  id: string;
  user_id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  customer_phone: string;
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: "customer" | "bot";
  timestamp: string;
}

export interface Lead {
  id: string;
  user_id: string;
  conversation_id: string;
  type: "order" | "booking" | "inquiry";
  customer_name: string;
  customer_phone: string;
  details: string;
  status: "new" | "contacted" | "converted";
  created_at: string;
}
