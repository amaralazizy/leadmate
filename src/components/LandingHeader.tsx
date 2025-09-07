"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import logo from "../../public/logo.png";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import { Button } from "@/components/ui/button";
import MobileSidebar from "@/components/MobileSidebar";
import { toast } from "sonner";

export default function LandingHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      if(pathname !== "/") router.push("/");
      else router.refresh();
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="relative z-10 bg-dark-bg border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              alt="LeadMate"
              height={150}
              width={150}
              className="w-full"
            />
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/about"
              className="text-foreground hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-white transition-colors"
            >
              Contact
            </Link>
            {loading ? (
              <span className="text-foreground">Loading...</span>
            ) : user ? (
              <>
                <span className="text-foreground px-3 py-2 text-sm">
                  Welcome, {user?.email}
                </span>
                <Button onClick={handleLogout} size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavigationButton href="/login">Login</NavigationButton>
                <NavigationButton href="/signup">Signup</NavigationButton>
              </>
            )}
          </div>

          {/* Mobile Sidebar */}
          <MobileSidebar />
        </div>
      </nav>
    </header>
  );
}
