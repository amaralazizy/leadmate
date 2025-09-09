import { z } from "zod";

export const leadSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  type: z.enum(["order", "booking", "inquiry"]),
  customer_name: z.string(),
  customer_phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  details: z.string(),
  status: z.enum(["new", "contacted", "converted"]),
  created_at: z.string().datetime(),
});