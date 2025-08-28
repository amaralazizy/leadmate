export default async function SettingsForm() {
  return (
    <section className="rounded-base border p-4 space-y-4">
      <h1 className="font-heading text-lg">Settings</h1>
      <div className="grid gap-3">
        <label className="text-sm">
          Business Name
          <input
            className="mt-1 w-full px-3 py-2 rounded-base border"
            placeholder="Your business"
          />
        </label>
        <label className="text-sm">
          WhatsApp Number
          <input
            className="mt-1 w-full px-3 py-2 rounded-base border"
            placeholder="+1 555 0123"
          />
        </label>
        <button className="px-3 py-2 rounded-base border w-fit">Save</button>
      </div>
    </section>
  );
}
