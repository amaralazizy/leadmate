"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import logo from "../../public/logo.png";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import { Button } from "@/components/ui/button";

export default function LandingHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Redirect first, then sign out
    router.push("/");
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <header className="relative z-10 bg-dark-bg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <Image src={logo} alt="LeadMate" height={40} width={60} />
            </Link>
            <div className="flex space-x-4">
              <span className="text-foreground">Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-10 bg-dark-bg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="LeadMate" height={40} width={60} />
          </Link>
          <div className="flex space-x-4">
            {user ? (
              <>
               <NavigationButton href="/dashboard">
                  Dashboard
                </NavigationButton>
                <span className="text-foreground px-3 py-2 text-sm">
                  Welcome, {user.business_name || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavigationButton href="/auth/login">Login</NavigationButton>
                <NavigationButton href="/waitlist">Join the Waitlist</NavigationButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
