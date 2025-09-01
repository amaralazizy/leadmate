import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AppSidebarItems } from "@/components/layout/AppSidebarItems";
import { AppSidebarFooter } from "@/components/layout/AppSidebarFooter";
export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className={cn("", className)}>
      <SidebarHeader>
        <Image src="/logo.png" alt="LeadMate" width={120} height={120} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <AppSidebarItems />
        </SidebarMenu>
      </SidebarContent>
      <AppSidebarFooter />
      <SidebarRail />
    </Sidebar>
  );
}
