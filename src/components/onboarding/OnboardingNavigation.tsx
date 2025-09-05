import { Button } from "@/components/ui/button";
import { OnboardingNavigationProps } from "./types";

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
        return !data.selectedNumber;
      case 3:
        return data.activationStatus !== "ONLINE";
      default:
        return false;
    }
  };

  const getNextButtonText = () => {
    if (loading) return "Working...";

    if (step === 3) {
      return data.activationStatus === "ONLINE"
        ? "Complete Setup"
        : "Activating...";
    }

    return "Next";
  };

  return (
    <div className="mt-8 flex justify-between">
      <Button
        type="button"
        onClick={onBack}
        disabled={step === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Back
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={isDisabled()}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {getNextButtonText()}
      </Button>
    </div>
  );
}
