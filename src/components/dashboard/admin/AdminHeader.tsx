import { requireAdmin } from "@/lib/auth/admin";
import AdminDashboardButton from "./AdminDashboardButton";
import { headers } from "next/headers";

export default async function AdminHeader() {
  try {
    const user = await requireAdmin();
    const headerList = await headers();
    const pathname = headerList.get("x-pathname");

    return (
      <div className="flex items-center justify-between px-3 pb-2 ">
        <h1 className="text-sm "> Hey {user.email} </h1>

        {pathname === "/dashboard/admin" ? <></> : <AdminDashboardButton />}
      </div>
    );
  } catch (error) {
    return <></>;
  }
}
