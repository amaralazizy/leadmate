"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import logo from "../../public/logo.png";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import { Button } from "@/components/ui/button";
// import { handleLogout } from "@/actions";
import { toast } from "sonner";

export default function LandingHeader() {
  const { user, loading } = useAuth();
  console.log("user", user);
  console.log("loading", loading);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="relative z-10 bg-dark-bg border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href="/" className="">
            <Image
              src={logo}
              alt="LeadMate"
              height={150}
              width={150}
              className="w-full"
            />
          </Link>

          <div className="flex space-x-4 items-center">
            <Link href="/about" className="text-foreground hover:text-white">About</Link>
            <Link href="/contact" className="text-foreground hover:text-white">Contact</Link>
            {loading ? (
              <span className="text-foreground">Loading...</span>
            ) : user ? (
              <>
                {/* <NavigationButton href="/dashboard">Dashboard</NavigationButton> */}
                <span className="text-foreground px-3 py-2 text-sm">
                  Welcome, {user?.email}
                </span>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <NavigationButton href="/login">Login</NavigationButton>
                <NavigationButton href="/signup">Signup</NavigationButton>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
