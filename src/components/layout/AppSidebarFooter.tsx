// "use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/shared/LogoutButton";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserIcon } from "lucide-react";

export async function AppSidebarFooter() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://github.com/shadcn.png?size=40"
                alt="CN"
              />
              <AvatarFallback>
                <UserIcon className="size-3/4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <Suspense fallback={<Skeleton className="h-4 w-16" />}>
                <span className="truncate font-heading">{user?.email?.split("@")[0]}</span>
              </Suspense>
              <Suspense fallback={<Skeleton className="h-4 w-16" />}>
                <span className="truncate text-xs">{user?.email}</span>
              </Suspense>
            </div>
          </div>
          <LogoutButton />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
