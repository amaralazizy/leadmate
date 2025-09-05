import { Check } from "lucide-react";

export default function CompletionStep() {
  return (
    <div className="space-y-6 text-center">
      <h3 className="text-lg font-medium text-gray-900">
        You&apos;re all set!
      </h3>
      <div className="bg-green-50 p-4 rounded-md">
        <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <p className="text-sm text-green-700">Your WhatsApp bot is active.</p>
      </div>
    </div>
  );
}
