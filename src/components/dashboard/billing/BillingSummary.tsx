export default async function BillingSummary() {
  const plan = { name: "Starter", price: "$19/mo", usage: "1,200 messages" };
  return (
    <section className="rounded-base border p-4">
      <h1 className="font-heading text-lg mb-2">Billing</h1>
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between">
          <span>Plan</span>
          <span>{plan.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Price</span>
          <span>{plan.price}</span>
        </div>
        <div className="flex justify-between">
          <span>Current usage</span>
          <span>{plan.usage}</span>
        </div>
      </div>
    </section>
  );
}
