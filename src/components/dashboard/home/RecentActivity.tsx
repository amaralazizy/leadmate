export default async function RecentActivity() {
  const items = [
    { id: 1, title: "New chat from +1 555-0123", time: "2m ago" },
    { id: 2, title: "Message sent to +44 20 7946 0958", time: "10m ago" },
    { id: 3, title: "Webhook set", time: "1h ago" },
  ];

  return (
    <section className="rounded-base border p-4">
      <h2 className="font-heading text-lg mb-2">Recent activity</h2>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between">
            <span className="text-sm">{i.title}</span>
            <span className="text-xs text-muted-foreground">{i.time}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
