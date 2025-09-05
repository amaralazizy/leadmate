import { OnboardingStepProps } from "./types";

export default function ActivationStep({ data }: OnboardingStepProps) {
  return (
    <div className="space-y-6 text-center">
      <h3 className="text-lg font-medium text-gray-900">
        We&apos;re activating your WhatsApp number
      </h3>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            Status: <strong>{data.activationStatus}</strong>
          </p>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>This may take a few minutes. You can keep this page open.</p>
        </div>
      </div>
    </div>
  );
}
