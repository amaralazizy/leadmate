import { Button } from "@/components/ui/button";
import { OnboardingNavigationProps } from "./types";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export default function OnboardingNavigation({
  step,
  loading,
  data,
  onNext,
  onBack,
}: OnboardingNavigationProps) {
  const isDisabled = () => {
    if (loading) return true;

    switch (step) {
      case 1:
        return !data.businessName;
      case 2:
        // Knowledge step is required
        return !data.knowledgeContent?.trim();
      case 3:
        return !data.selectedNumber;
      case 4:
        return !data.whatsappActivated;
      case 5:
        return data.activationStatus !== "ONLINE";
      default:
        return false;
    }
  };

  const getNextButtonText = () => {
    if (loading) return "Working...";

    if (step === 2) {
      return "Upload Knowledge";
    }

    if (step === 5) {
      return data.activationStatus === "ONLINE"
        ? "Complete Setup"
        : "Activating...";
    }

    if (step === 6) {
      return "Go to Dashboard";
    }

    return "Continue";
  };

  const getNextButtonIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;

    if (step === 5 && data.activationStatus === "ONLINE") {
      return <CheckCircle className="h-4 w-4" />;
    }

    if (step === 6) {
      return <CheckCircle className="h-4 w-4" />;
    }

    return <ArrowRight className="h-4 w-4" />;
  };

  return (
    <div className="mt-12 pt-6 border-t-2 border-border">
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          onClick={onBack}
          disabled={step === 1}
          variant="neutral"
          size="lg"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-foreground/60">
            <span>Step {step} of 6</span>
          </div>

          <Button
            type="button"
            onClick={onNext}
            disabled={isDisabled()}
            variant="default"
            size="lg"
            className="flex items-center gap-2 min-w-[140px] justify-center"
          >
            <span>{getNextButtonText()}</span>
            {getNextButtonIcon()}
          </Button>
        </div>
      </div>

      {/* Progress hint */}
      {isDisabled() && !loading && (
        <div className="mt-4 text-center">
          <p className="text-sm text-foreground/60">
            {step === 1 && "Please enter your business name to continue"}
            {step === 2 && "Please add your business knowledge to continue"}
            {step === 3 && "Please select a phone number to continue"}
            {step === 4 &&
              "Please confirm you've sent the WhatsApp message to continue"}
            {step === 5 && "Waiting for WhatsApp activation..."}
          </p>
        </div>
      )}
    </div>
  );
}
