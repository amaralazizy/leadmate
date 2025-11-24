"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data/navLinks";
import { cn } from "@/lib/utils";
import { NavigationButton } from "@/components/JoinWaitlistButton";
import ClientLogoutButton from "@/components/shared/ClientLogoutButton";

type DesktopNavProps = {
  isAuthenticated: boolean;
  user?: { username?: string | null } | null;
  hideAuthButtons?: boolean;
};

export default function DesktopNav({
  isAuthenticated,
  user,
  hideAuthButtons = false,
}: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex items-center w-full gap-8">
      {/* Logo - Left */}
      <Link href="/" className="flex-shrink-0">
        <Image
          src="/logo-transparent.png"
          alt="LeadMate"
          width={150}
          height={48}
          className="w-[clamp(120px,10vw,160px)] h-auto object-contain"
        />
      </Link>

      {/* Centered Navigation Links */}
      <div className="flex items-center gap-1 flex-1 justify-center">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/" && pathname?.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group inline-flex items-center gap-2 px-4 py-2 rounded-full text-foreground/80 hover:text-white transition-all duration-200",
                "hover:bg-white/10",
                isActive && "bg-white/15 text-white"
              )}
            >
              <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Right side CTAs */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {!hideAuthButtons && (
          <>
            {isAuthenticated ? (
              <>
                <NavigationButton href="/dashboard" variant="neutral" size="sm">
                  Dashboard
                </NavigationButton>
                <ClientLogoutButton variant="glass" size="sm">
                  Logout
                </ClientLogoutButton>
              </>
            ) : (
              <>
                <NavigationButton
                  href="/signup"
                  size="lg"
                  className="text-lg !px-6 "
                >
                  Get Started
                </NavigationButton>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
