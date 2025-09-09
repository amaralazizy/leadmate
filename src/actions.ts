"use server";

import { createClient } from "@/lib/supabase/server";
import { getErrorMessage } from "@/lib/utils";
import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

export const handleSignUp = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    // console.log("error", error);
    if (error) throw error;
    return { message: "User created successfully" };
  } catch (error) {
    return { message: getErrorMessage(error) };
  }
};

export const handleLogout = async () => {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    revalidatePath("/", "layout");
    return { message: "User logged out successfully" };
  } catch (error) {
    return { message: getErrorMessage(error) };
  }
};

export const handleLogin = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { message: "User logged in successfully" };
  } catch (error) {
    return { message: getErrorMessage(error) };
  }
};
