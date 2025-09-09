import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  content: z.string().min(1),
  sender: z.enum(["customer", "bot"]),
  timestamp: z.string().datetime(),
});
