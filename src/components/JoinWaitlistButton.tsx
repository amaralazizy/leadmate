import Link from "next/link";
import { Button } from "@/components/ui/button";

type NavigationButtonProps  = {
  children: React.ReactNode;
  className?: string;
  href: string;
}

export function NavigationButton({ children, className, href }: NavigationButtonProps) {
  return (
    <Button className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}