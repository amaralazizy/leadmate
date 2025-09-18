import { z } from "zod";
import { createFormPrevStateSchema } from "./formPrevState";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type TloginSchema = z.infer<typeof loginSchema>;

export const loginFormPrevStateSchema = createFormPrevStateSchema(loginSchema);

export type TloginFormPrevState = z.infer<typeof loginFormPrevStateSchema>;