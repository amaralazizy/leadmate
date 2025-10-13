"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import { Button } from "@/components/ui/button";
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
        className="lg:hidden p-2 rounded-md text-foreground hover:text-white hover:bg-dark-card transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-black  border-l border-white/20 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/" onClick={closeSidebar}>
              <Image
                src="/logo-transparent.png"
                alt="LeadMate"
                height={150}
                width={150}
              />
            </Link>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-md text-main hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6 space-y-2">
            {/* Dashboard Link - Only show when authenticated */}
            {user && (
              <Link
                href="/dashboard"
                onClick={closeSidebar}
                className={cn(
                  "flex items-center px-4 py-3 text-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300",
                  pathname.startsWith("/dashboard") && "text-white bg-white/10"
                )}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            )}

            {/* Regular Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center px-4 py-3 text-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-300",
                  pathname === link.href && "text-white bg-white/10"
                )}
              >
                <link.icon className="h-5 w-5 mr-3" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="p-6 border-t border-white/10">
            {loading ? (
              <div className="text-center text-foreground">Loading...</div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 bg-main/10 rounded-full flex items-center justify-center">
                    <span className="text-main font-semibold text-sm">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.email?.split("@")[0] || "User"}
                    </p>
                    <p className="text-xs text-foreground/60 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => logout()}
                  variant="neutral"
                  className="w-full"
                >
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
                  Get Started
                </NavigationButton>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* <div className={cn("z-50 inset-0 bg-black", !isOpen && "hidden")}></div> */}
    </>
  );
}
