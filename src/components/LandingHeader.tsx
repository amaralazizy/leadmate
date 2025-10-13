import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth/server";
import MobileSidebar from "@/components/MobileSidebar";
import DesktopNav from "@/components/landing/DesktopNav";

type LandingHeaderProps = {
  hideAuthButtons?: boolean;
};

export default async function LandingHeader({
  hideAuthButtons = false,
}: LandingHeaderProps) {
  const { user, isAuthenticated } = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 supports-[backdrop-filter]:bg-white/5 bg-white/0 backdrop-blur-md border-b border-white/10 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Mobile Logo - Left (mobile only) */}
          <Link href="/" className="flex-shrink-0 lg:hidden">
            <Image
              src="/logo-transparent.png"
              alt="LeadMate"
              width={150}
              height={48}
              className="w-[clamp(120px,10vw,160px)] h-auto object-contain"
            />
          </Link>

          {/* Desktop Nav - Contains Logo, Nav Links & Auth Buttons */}
          <DesktopNav
            isAuthenticated={!!isAuthenticated}
            user={user}
            hideAuthButtons={hideAuthButtons}
          />

          {/* Mobile Sidebar - Right (mobile only) */}
          <MobileSidebar />
        </div>
      </nav>
    </header>
  );
}
