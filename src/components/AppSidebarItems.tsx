"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { CreditCard, Home, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const pages = [
  { title: "Home", icon: Home, href: "/dashboard" },
  { title: "Chats", icon: MessageSquare, href: "/dashboard/chats" },
  { title: "Billing", icon: CreditCard, href: "/dashboard/billing" },
  { title: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export function AppSidebarItems() {
    const pathname = usePathname();
    return (
      <>
        {pages.map((item, index) => (
          <SidebarMenuItem
            key={index}
            className={cn({
              "bg-main text-black border-border border-2":
                pathname === item.href,
            })}
          >
            <SidebarMenuButton asChild>
              <Link href={item.href}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </>
    );
}