import { LucideIcon } from "lucide-react";

interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function HowItWorksStep({
  step,
  title,
  description,
  icon: Icon,
}: HowItWorksStepProps) {
  return (
    <div className="text-center relative border-2 border-border rounded-2xl p-4">
      {/* Step Number */}
      <div className="inline-flex items-center justify-center w-12 h-12 bg-main text-main-foreground font-bold text-lg rounded-full mb-4">
        {step}
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 bg-dark-card border border-border rounded-2xl mx-auto mb-6">
        <Icon className="h-8 w-8 text-main" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-foreground leading-relaxed">{description}</p>
    </div>
  );
}
