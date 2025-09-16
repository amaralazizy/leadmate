import HowItWorksStep from "./HowItWorksStep";
import { steps } from "@/lib/data/steps";
import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredContainer from "@/components/animations/StaggeredContainer";

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24">
      <AnimatedSection delay={0.2}>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            From Setup to Success in Under 5 Minutes
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
            While your competitors are still figuring out WhatsApp, you'll be
            capturing leads. Here's how simple it is to get started:
          </p>
        </div>
      </AnimatedSection>

      <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {steps.map((stepItem, index) => (
          <HowItWorksStep
            key={index}
            step={stepItem.step}
            title={stepItem.title}
            description={stepItem.description}
            iconName={stepItem.iconName}
          />
        ))}
      </StaggeredContainer>

      <AnimatedSection delay={0.8} className="mt-16 text-center">
        <div className="bg-gradient-to-r from-main/10 to-blue-500/10 border border-main/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">
            ⚡ Ready in Minutes, Not Weeks
          </h3>
          <p className="text-foreground text-lg mb-6">
            No technical skills required. No lengthy setup process. No waiting
            for developers. Just instant WhatsApp automation that starts working
            immediately.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center text-main">
              <span className="w-2 h-2 bg-main rounded-full mr-2"></span>
              5-minute setup
            </div>
            <div className="flex items-center text-main">
              <span className="w-2 h-2 bg-main rounded-full mr-2"></span>
              Zero technical knowledge needed
            </div>
            <div className="flex items-center text-main">
              <span className="w-2 h-2 bg-main rounded-full mr-2"></span>
              Instant lead capture
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
