import { z } from "zod";
import { createFormPrevStateSchema } from "./formPrevState";

export const resetPasswordSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type TresetPassword= z.infer<typeof resetPasswordSchema>;

export const resetPasswordFormPrevStateSchema = createFormPrevStateSchema(resetPasswordSchema);

export type TresetPasswordFormPrevState = z.infer<typeof resetPasswordFormPrevStateSchema>;