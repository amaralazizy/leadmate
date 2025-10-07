"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/actions";

export default function LogoutButton() {

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

  return (
    <Button onClick={handleClientLogout} className="w-full">
      <span className="group-data-[collapsible=icon]:hidden">Logout</span>
      <LogOut className="size-4" />
    </Button>
  );
}
