"use server";
import { createClient } from "@/lib/supabase/server";
import { TresetPasswordConfirmationFormPrevState } from "@/lib/schemas/resetPasswordConfirmation";

export const handleResetPasswordConfirmation = async (
  prevState: TresetPasswordConfirmationFormPrevState,
  formData: FormData
): Promise<TresetPasswordConfirmationFormPrevState> => {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) {
    return {
      success: false,
      errors: { supabase: [error.message] },
      inputs: { password: password, confirmPassword: confirmPassword },
    };
  }
  return { success: true, inputs: { password: password, confirmPassword: confirmPassword } };
};