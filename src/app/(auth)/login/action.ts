"use server";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/login";

type LoginState = {
  success: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    supabase?: string[];
  };
  inputs: {
    email: string;
    password: string;
  };
};

export async function handleLogin(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      inputs: rawData,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      success: false,
      errors: { supabase: [error.message] },
      inputs: rawData,
    };
  }

  return {
    success: true,
    inputs: rawData,
  };
}
