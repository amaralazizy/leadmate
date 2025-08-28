import Link from "next/link";

export default async function QuickActions() {
  const actions = [
    { href: "/dashboard/chats", label: "View Chats" },
    { href: "/dashboard/settings", label: "Settings" },
    { href: "/dashboard/billing", label: "Billing" },
  ];

  return (
    <section className="rounded-base border p-4">
      <h2 className="font-heading text-lg mb-2">Quick actions</h2>
      <div className="flex gap-2 flex-wrap">
        {actions.map((a) => (
          <Link
            key={a.href}
            className="px-3 py-2 rounded-base border text-sm hover:bg-accent"
            href={a.href}
          >
            {a.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
