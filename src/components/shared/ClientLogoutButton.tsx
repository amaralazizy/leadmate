"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { handleLogout } from "@/actions";

interface ClientLogoutButtonProps {
  children?: React.ReactNode;
  size?: "sm" | "default" | "lg";
  variant?:
    | "default"
    | "noShadow"
    | "neutral"
    | "reverse"
    | "neutral"
    | "reverse";
}

export default function ClientLogoutButton({
  children = "Logout",
  size = "sm",
  variant = "default",
}: ClientLogoutButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClientLogout = async () => {
    try {
      const { message } = await handleLogout();
      if (message === "User logged out successfully")
        return { message: message };
      else throw new Error(message);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to logout"
      );
    }
  };

  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    onMutate: () => {
      toast.loading("Logging out...");
    },
    mutationFn: handleClientLogout,
    onSuccess: () => {
      toast.dismiss(); // Clear loading toast
      toast.success("Logged out successfully");
      if (pathname !== "/") router.push("/");
      else router.refresh();
    },
    onError: (error) => {
      toast.dismiss(); // Clear loading toast
      toast.error(error.message || "Failed to logout");
    },
  });

  return (
    <Button onClick={() => logout()} size={size} variant={variant}>
      {children}
    </Button>
  );
}
