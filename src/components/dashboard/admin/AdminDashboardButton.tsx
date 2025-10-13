"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminDashboardButton() {
  const router = useRouter();

  return (
    <Button
      className="text-sm "
      onClick={() => router.push("/dashboard/admin")}
      variant="default"
    >
      go to admin dashboard
    </Button>
  );
}
