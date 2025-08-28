import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/LogoutButton";
import { AppSidebarItems } from "@/components/AppSidebarItems";

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props} className={cn("",className)}>
      <SidebarHeader>
        <Image src="/logo.png" alt="LeadMate" width={120} height={120} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <AppSidebarItems />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton
              className="group-data-[state=collapsed]:hover:outline-0 group-data-[state=collapsed]:hover:bg-transparent overflow-visible "
              size="lg"
            > */}
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png?size=40"
                  alt="CN"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-heading"></span>
                <span className="truncate text-xs"></span>
              </div>
              <LogoutButton />
            {/* </SidebarMenuButton> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
