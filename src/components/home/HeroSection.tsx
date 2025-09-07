export default function HeroSection() {
  return (
    <div className="text-center flex flex-col items-center gap-8">
      {/* Logo */}
      <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
        <span className="block">Smarter WhatsApp Conversations</span>
        <span className="block text-main">for Your Business</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground sm:text-xl md:mt-8">
        LeadMate helps you provide instant, AI-powered responses to your
        customers on WhatsApp — anytime, anywhere.
      </p>
    </div>
  );
}
