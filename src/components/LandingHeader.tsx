import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/server";
import logo from "../../public/logo.png";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import MobileSidebar from "@/components/MobileSidebar";
import ClientLogoutButton from "@/components/shared/ClientLogoutButton";

export default async function LandingHeader() {
  const { user, isAuthenticated } = await getCurrentUser();

  return (
    <header className="z-10 bg-background border-b border-gray-800 sticky top-0">
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
            {isAuthenticated && user ? (
              <>
                <span className="text-foreground px-3 py-2 text-sm">
                  Welcome, {user.email}
                </span>
                <ClientLogoutButton size="sm">Logout</ClientLogoutButton>
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
