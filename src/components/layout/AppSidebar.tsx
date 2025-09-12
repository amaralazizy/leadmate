import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebarItems } from "@/components/layout/AppSidebarItems";
import { AppSidebarFooter } from "@/components/layout/AppSidebarFooter";
import AppSidebarLogo from "@/components/layout/AppSidebarLogo";

export function AppSidebar({
  className,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className={cn("", className)}>
      <SidebarHeader className="flex justify-center items-center p-4">
        <AppSidebarLogo />
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
