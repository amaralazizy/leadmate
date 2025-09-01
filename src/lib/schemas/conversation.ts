import { z } from "zod";

export const conversationSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  customer_phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  status: z.enum(["active", "completed", "archived"]),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
});