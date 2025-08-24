export default function WaitlistFeatures() {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered",
      description: "Advanced language models trained on your business",
    },
    {
      icon: "⚡",
      title: "Instant Setup",
      description: "Get started in under 10 minutes",
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {features.map((feature, index) => (
        <div
          key={index}
          className="rounded-2xl border-2 p-6 hover:-translate-x-1 hover:-translate-y-1 transition-all bg-dark-card border-accent-green shadow-[6px_6px_0px_0px_rgba(57,255,20,0.8)] hover:shadow-[8px_8px_0px_0px_rgba(57,255,20,1)]"
        >
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
          <p className="text-text-light">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
