import HowItWorksStep from "./HowItWorksStep";
import { steps } from "@/lib/data/steps";

export default function HowItWorksSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          How LeadMate Works
        </h2>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
          Get started with AI-powered WhatsApp support in 4 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
        {steps.map((stepItem, index) => (
          <HowItWorksStep
            key={index}
            step={stepItem.step}
            title={stepItem.title}
            description={stepItem.description}
            icon={stepItem.icon}
          />
        ))}
      </div>
    </section>
  );
}
