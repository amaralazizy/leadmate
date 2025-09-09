export default function HeroSection() {
  return (
    <section className="py-12 md:py-20 lg:py-24 hero">
      <div className="text-center flex flex-col items-center gap-6 md:gap-8">
        {/* Logo */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-white leading-tight">
          <span className="block">Smarter WhatsApp Conversations</span>
          <span className="block text-main">for Your Business</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed px-4">
          LeadMate helps you provide instant, AI-powered responses to your
          customers on WhatsApp — anytime, anywhere.
        </p>
      </div>
    </section>
  );
}
