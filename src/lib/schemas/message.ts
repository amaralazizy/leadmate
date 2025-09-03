import { z } from "zod";

export const messageSchema = z.object({
  id: z.uuid(),
  conversation_id: z.uuid(),
  content: z.string().min(1),
  sender: z.enum(["customer", "bot"]),
  timestamp: z.iso.datetime(),
});
