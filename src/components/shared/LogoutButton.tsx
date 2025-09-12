"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button onClick={handleLogout} className="w-full">
      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
      <LogOut className="size-4" />
    </Button>
  );
}
