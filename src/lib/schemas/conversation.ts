import { z } from "zod";

export const conversationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  customer_phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  status: z.enum(["active", "completed", "archived"]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});