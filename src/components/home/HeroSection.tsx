import AnimatedSection from "@/components/animations/AnimatedSection";
import { NavigationButton } from "@/components/JoinWaitlistButton";

export default function HeroSection() {
  return (
    <section className="py-12 md:py-20 lg:py-24 hero">
      <div className="text-center flex flex-col items-center gap-6 md:gap-8">
        <AnimatedSection delay={0.4}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-extrabold text-white leading-tight">
            <span className="block">Never Lose Another Customer</span>
            <span className="block text-main">to Slow WhatsApp Responses</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed px-4">
            LeadMate's AI responds to your WhatsApp customers in{" "}
            <span className="text-main font-semibold">under 3 seconds</span>,
            24/7. Capture every lead, close more sales, and never miss a
            business opportunity again.
          </p>
        </AnimatedSection>

        <AnimatedSection
          delay={0.8}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <NavigationButton
            href="/signup"
            className="bg-main hover:bg-main/90 text-black font-bold px-8 py-4 sm:px-12 sm:py-6 text-lg sm:text-xl md:text-2xl w-full sm:w-auto"
          >
            Start Free Trial
          </NavigationButton>
        </AnimatedSection>

        <AnimatedSection delay={1.0} className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-main mb-2">3 sec</div>
              <div className="text-sm text-foreground/80">
                Average Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-main mb-2">24/7</div>
              <div className="text-sm text-foreground/80">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-main mb-2">95%</div>
              <div className="text-sm text-foreground/80">
                Customer Satisfaction
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
