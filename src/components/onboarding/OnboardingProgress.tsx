import { Check, ArrowRight } from "lucide-react";
import { ONBOARDING_STEPS } from "./constants";

interface OnboardingProgressProps {
  currentStep: number;
}

export default function OnboardingProgress({
  currentStep,
}: OnboardingProgressProps) {
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="flex items-center justify-center space-x-8">
        {ONBOARDING_STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep >= step.number ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
              {step.number < ONBOARDING_STEPS.length && (
                <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
