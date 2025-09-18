import { z } from "zod";
import { createFormPrevStateSchema } from "./formPrevState";

export const resetPasswordConfirmationSchema = z.object({
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: z
    .string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
});

export type TresetPasswordConfirmation = z.infer<
  typeof resetPasswordConfirmationSchema
>;

export const resetPasswordConfirmationFormPrevStateSchema =
  createFormPrevStateSchema(resetPasswordConfirmationSchema);

export type TresetPasswordConfirmationFormPrevState = z.infer<
  typeof resetPasswordConfirmationFormPrevStateSchema
>;
