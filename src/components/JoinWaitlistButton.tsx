import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type NavigationButtonProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  asChild?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
};

export function NavigationButton({
  children,
  className,
  href,
  asChild = true,
  variant = "default",
  size = "default",
}: NavigationButtonProps) {
  return (
    <Button
      asChild={asChild}
      variant={variant}
      size={size}
      className={className}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
