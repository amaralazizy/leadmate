import { z } from "zod";

export const leadSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  conversation_id: z.uuid(),
  type: z.enum(["order", "booking", "inquiry"]),
  customer_name: z.string(),
  customer_phone: z.string().regex(/^\+[1-9]\d{1,14}$/),
  details: z.string(),
  status: z.enum(["new", "contacted", "converted"]),
  created_at: z.iso.datetime(),
});