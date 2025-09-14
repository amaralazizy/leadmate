import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <Card className="p-6 flex flex-col items-center hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all duration-300">
      {/* Step Number */}
      <div className="inline-flex items-center justify-center w-12 h-12 bg-main text-main-foreground font-bold text-lg rounded-full">
        {step}
      </div>

      {/* Icon */}
      <div className="flex items-center justify-center w-16 h-16 bg-dark-card border border-border rounded-2xl mx-auto">
        <Icon className="h-8 w-8 text-main" />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-foreground leading-relaxed">{description}</p>
    </Card>
  );
}
