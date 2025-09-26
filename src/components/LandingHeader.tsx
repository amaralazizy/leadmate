import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/server";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import MobileSidebar from "@/components/MobileSidebar";
import ClientLogoutButton from "@/components/shared/ClientLogoutButton";

type LandingHeaderProps = {
  hideAuthButtons?: boolean;
};

export default async function LandingHeader({
  hideAuthButtons = false,
}: LandingHeaderProps) {
  const { user, isAuthenticated } = await getCurrentUser();

  return (
    <header className="z-10 bg-background border-b border-border sticky top-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <Link href="/" className="flex-shrink-0">
            {/* make the logo responsive */}
            <Image
              src="/logo-transparent.png"
              alt="LeadMate"
              width={150}
              height={150}
              className="w-[calc(5rem+8vw)] h-full object-contain"
            />
          </Link>

          <div className="hidden lg:flex space-x-6 items-center">
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
            {!hideAuthButtons && (
              <>
                {isAuthenticated && user ? (
                  <>
                    <span className="text-foreground px-3 py-2 text-sm">
                      Welcome, {user.username}
                    </span>
                    <NavigationButton href="/dashboard">
                      Dashboard
                    </NavigationButton>
                    <ClientLogoutButton size="sm">Logout</ClientLogoutButton>
                  </>
                ) : (
                  <>
                    <NavigationButton href="/login">Login</NavigationButton>
                    <NavigationButton href="/signup">Signup</NavigationButton>
                  </>
                )}
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
