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
  is_read: boolean;
}

export interface Lead {
  id: string;
  user_id: string;
  conversation_id: string;
  type: "order" | "booking" | "inquiry";
  customer_name: string;
  customer_phone: string;
  details?: string;
  status: "new" | "contacted" | "converted";
  created_at: string;
}
