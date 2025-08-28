export default async function OverviewCards() {
  const stats = [
    { label: "Active Chats", value: 3 },
    { label: "New Messages", value: 12 },
    { label: "Response Time", value: "2m" },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-base border p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-heading mt-1">{s.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
