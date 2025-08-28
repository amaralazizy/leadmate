"use client";
import { capitalize } from "@/lib/utils";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.slice(1).split("/");
  return (
    <BreadcrumbList>
      {parts.map((part, index) => (
        <Fragment key={part}>
          <BreadcrumbItem >
            <BreadcrumbLink href={"/"+parts.slice(0, index + 1).join("/")}>
              <BreadcrumbPage>{capitalize(part)}</BreadcrumbPage>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index !== parts.length - 1 && (
            <BreadcrumbSeparator className="hidden md:block" />
          )}
        </Fragment>
      ))}
      {/* <BreadcrumbItem className="hidden md:block">
        <BreadcrumbLink href={pathname}>
          <BreadcrumbPage>{capitalize(pathname.split("/")[1] ?? '')}</BreadcrumbPage>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href={pathname}>
          <BreadcrumbPage>{capitalize(pathname.split("/")[2] ?? '')}</BreadcrumbPage>
        </BreadcrumbLink>
      </BreadcrumbItem> */}
    </BreadcrumbList>
  );
}
