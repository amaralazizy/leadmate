"use client";

// import {
//   MessageSquare,
//   Users,
//   TrendingUp,
//   Settings,
//   Upload,
//   Phone,
// } from "lucide-react";

// import ClientHeader from "@/components/ClientHeader";
// import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";


export default function DashboardPage() {

  return (
    <>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-base bg-background/50 border-2 border-border" />
            <div className="aspect-video rounded-base bg-background/50 border-2 border-border" />
            <div className="aspect-video rounded-base bg-background/50 border-2 border-border" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-base bg-background/50 border-2 border-border md:min-h-min" />
        </div>
    </>
  );
}
