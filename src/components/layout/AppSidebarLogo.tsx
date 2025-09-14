"use client";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
// import { cn } from "@/lib/utils";
export default function AppSidebarLogo() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Link href="/" className="flex justify-center items-center">
      <div
        className="relative transition-all duration-200 ease-in-out overflow-hidden flex-shrink-0 w-[120px] h-[40px]"
      >
        {isCollapsed ? (
          <Image
            src="/og-image.png"
            alt="LeadMate"
            fill
            className="object-contain transition-all duration-200 ease-in-out"
            priority
            sizes="32px"
          />
        ) : (
          <Image
            src="/logo.png"
            alt="LeadMate"
            fill
            className="object-contain transition-all duration-200 ease-in-out"
            priority
            sizes="120px"
          />
        )}
      </div>
    </Link>
  );
}
