"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import { Button } from "@/components/ui/button";
import logo from "../../public/logo.png";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { navLinks } from "@/lib/data/navLinks";
import { handleLogout } from "@/actions";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const { mutate: logout } = useMutation({
    mutationFn: handleLogout,
    onSuccess: () => {
      toast.success("Logged out successfully");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-md text-foreground hover:text-white hover:bg-dark-card transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-dark-bg border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/" onClick={closeSidebar}>
              <Image src={logo} alt="LeadMate" height={150} width={150} />
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-main hover:text-white hover:bg-dark-card transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center px-4 py-3 text-foreground hover:text-main hover:bg-dark-card rounded-lg transition-colors duration-300",
                  pathname === link.href &&
                    "text-main-foreground bg-main hover:text-main-foreground hover:bg-main"
                )}
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="p-6 border-t border-border">
            {loading ? (
              <div className="text-center text-foreground">Loading...</div>
            ) : user ? (
              <div className="space-y-4">
                <div className="text-sm text-foreground">
                  Welcome, {user.email}
                </div>
                <Button onClick={() => logout()} className="w-full">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <NavigationButton
                  href="/login"
                  className="w-full justify-center"
                >
                  Login
                </NavigationButton>
                <NavigationButton
                  href="/signup"
                  className="w-full justify-center"
                >
                  Signup
                </NavigationButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
