import { createClient } from "@/lib/supabase/server";

export function isAdminEmail(email?: string | null): boolean {
  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && allowlist.includes(email.toLowerCase());
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    throw new Error("Admin only");
  }

  return user;
}
