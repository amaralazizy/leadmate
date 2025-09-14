import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  content: z.string().min(1),
  sender: z.enum(["customer", "bot"]),
  timestamp: z.string().datetime(),
  is_read: z.boolean().default(false),
});

// Schema for creating new messages (without id and timestamp)
export const createMessageSchema = messageSchema.omit({
  id: true,
  timestamp: true,
});

// Schema for updating message read status
export const updateMessageReadSchema = z.object({
  messageIds: z.array(z.string().uuid()),
  isRead: z.boolean(),
});
