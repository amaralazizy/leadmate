import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppBreadcrumb from "@/components/layout/AppBreadcrumb";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden p-2 sm:p-4 md:p-6 lg:p-8 xl:p-12">
        <header className="flex h-12 sm:h-14 md:h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 px-2 sm:px-4">
            <SidebarTrigger className="-ml-1 p-1 sm:p-2" />
            <AppBreadcrumb />
          </div>
        </header>
        <main className="min-h-[calc(100vh-8rem)] w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
