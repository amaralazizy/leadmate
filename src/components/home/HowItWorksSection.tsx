import HowItWorksStep from "./HowItWorksStep";
import { steps } from "@/lib/data/steps";
import AnimatedSection from "@/components/animations/AnimatedSection";
import StaggeredContainer from "@/components/animations/StaggeredContainer";

export default function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-main/5 blur-[100px] rounded-full -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection delay={0.2}>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              From Setup to Success in <span className="text-main">Minutes</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              While your competitors are still figuring out WhatsApp, you'll be
              capturing leads. Here's how simple it is to get started:
            </p>
          </div>
        </AnimatedSection>

        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {steps.map((stepItem, index) => (
            <HowItWorksStep
              key={index}
              step={stepItem.step}
              title={stepItem.title}
              description={stepItem.description}
              iconName={stepItem.iconName}
              isLast={index === steps.length - 1}
            />
          ))}
        </StaggeredContainer>

        <AnimatedSection delay={0.8} className="mt-20 text-center">
          <div className="bg-secondary/50 border border-border/50 rounded-2xl p-8 max-w-5xl mx-auto backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="text-left">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                        ⚡ Ready in Minutes, Not Weeks
                    </h3>
                    <p className="text-muted-foreground text-base">
                        No technical skills required. Just instant WhatsApp automation.
                    </p>
                 </div>
                 <div className="flex flex-wrap gap-4 text-sm">
                    <div className="px-5 py-2.5 rounded-full bg-background border border-border flex items-center gap-2 text-foreground font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        5-minute setup
                    </div>
                     <div className="px-5 py-2.5 rounded-full bg-background border border-border flex items-center gap-2 text-foreground font-medium">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        Zero coding
                    </div>
                 </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
