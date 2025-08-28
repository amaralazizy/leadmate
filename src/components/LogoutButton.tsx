"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
    supabase.auth.signOut();
  };

  return (
    <Button onClick={handleLogout} className="h-full">
      <LogOut className="ml-auto size-4" />
    </Button>
  );
}