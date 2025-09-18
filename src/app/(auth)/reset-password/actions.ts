"use server";
import { createClient } from "@/lib/supabase/server";
import {
  TresetPasswordFormPrevState,
  resetPasswordSchema,
} from "@/lib/schemas/resetPassword";

export const handleResetPassword = async (
  prevState: TresetPasswordFormPrevState,
  formData: FormData
): Promise<TresetPasswordFormPrevState> => {
  const email = formData.get("email");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email as string, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL!}/reset-password-confirmation`,
  });
  if (error) {
    return {
      success: false,
      errors: { supabase: [error.message] },
      inputs: { email: email as string },
    };
  }
  if (!resetPasswordSchema.safeParse({ email: email as string }).success) {
    return {
      success: false,
      errors: { email: ["Invalid email address"] },
      inputs: { email: email as string },
    };
  }
  return { success: true, inputs: { email: email as string } };
};
