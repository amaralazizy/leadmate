import { Check, ArrowRight } from "lucide-react";
import { ONBOARDING_STEPS } from "./constants";

interface OnboardingProgressProps {
  currentStep: number;
}

export default function OnboardingProgress({
  currentStep,
}: OnboardingProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile Progress Bar */}
      <div className="block md:hidden mb-6">
        <div className="flex items-center justify-between text-sm text-foreground/70 mb-2">
          <span>Progress</span>
          <span>
            {currentStep} of {ONBOARDING_STEPS.length}
          </span>
        </div>
        <div className="w-full bg-secondary-background rounded-base border-2 border-border h-3">
          <div
            className="bg-main h-full rounded-base transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Desktop Step Indicators */}
      <div className="hidden md:block">
        {/* Step Circles Row */}
        <div className="flex items-center justify-between mb-4">
          {ONBOARDING_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-base border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-main text-main-foreground border-border shadow-shadow"
                      : isActive
                      ? "bg-secondary-background text-foreground border-main shadow-shadow animate-pulse"
                      : "bg-secondary-background text-foreground/40 border-border"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Title */}
                <div className="mt-3 text-center">
                  <div
                    className={`text-sm font-base ${
                      isActive || isCompleted
                        ? "text-foreground font-bold"
                        : "text-foreground/50"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-foreground/40 mt-1">
                    Step {step.number}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary-background rounded-base border-2 border-border h-3 mt-6">
          <div
            className="bg-main h-full rounded-base transition-all duration-500 ease-out"
            style={{
              width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
