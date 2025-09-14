import { OnboardingStepProps } from "./types";
import { Zap, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ActivationStep({ data }: OnboardingStepProps) {
  const getStatusIcon = () => {
    switch (data.activationStatus) {
      case "ONLINE":
        return <CheckCircle className="h-8 w-8 text-main" />;
      case "PENDING":
        return <Loader2 className="h-8 w-8 text-foreground/60 animate-spin" />;
      case "FAILED":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Clock className="h-8 w-8 text-foreground/60" />;
    }
  };

  const getStatusMessage = () => {
    switch (data.activationStatus) {
      case "ONLINE":
        return {
          title: "🎉 WhatsApp Number Activated!",
          description:
            "Your WhatsApp Business number is now active and ready to receive messages.",
          color: "text-main",
        };
      case "PENDING":
        return {
          title: "⏳ Activating Your WhatsApp Number",
          description:
            "We're setting up your WhatsApp Business account. This usually takes 2-5 minutes.",
          color: "text-foreground",
        };
      case "FAILED":
        return {
          title: "❌ Activation Failed",
          description:
            "There was an issue activating your number. Please try again or contact support.",
          color: "text-red-500",
        };
      default:
        return {
          title: "🔄 Processing Activation",
          description: "Setting up your WhatsApp Business integration...",
          color: "text-foreground",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-main rounded-base border-2 border-border shadow-shadow flex items-center justify-center mb-4">
          <Zap className="h-6 w-6 text-main-foreground" />
        </div>
        <h3 className="text-xl font-heading text-foreground mb-2">
          WhatsApp Activation
        </h3>
        <p className="text-sm text-foreground/70">
          Setting up your business WhatsApp integration
        </p>
      </div>

      {/* Status Display */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">{getStatusIcon()}</div>

        <div className="space-y-2">
          <h4 className={`text-lg font-heading ${statusInfo.color}`}>
            {statusInfo.title}
          </h4>
          <p className="text-sm text-foreground/70 max-w-md mx-auto">
            {statusInfo.description}
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-base border-2 border-border bg-secondary-background">
          <div
            className={`w-2 h-2 rounded-full ${
              data.activationStatus === "ONLINE"
                ? "bg-green-500"
                : data.activationStatus === "PENDING"
                ? "bg-yellow-500 animate-pulse"
                : data.activationStatus === "FAILED"
                ? "bg-red-500"
                : "bg-gray-400"
            }`}
          />
          <span className="text-sm font-base text-foreground">
            Status: {data.activationStatus}
          </span>
        </div>

        {/* Progress Steps */}
        {data.activationStatus === "PENDING" && (
          <div className="space-y-4 mt-8">
            <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
              <h5 className="text-sm font-base text-foreground mb-3">
                Activation Progress:
              </h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-main" />
                  <span className="text-xs text-foreground/70">
                    Number purchased and registered
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 text-foreground/60 animate-spin" />
                  <span className="text-xs text-foreground/70">
                    Configuring WhatsApp Business API
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-foreground/40" />
                  <span className="text-xs text-foreground/40">
                    Verifying webhook connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {data.activationStatus === "ONLINE" && (
          <div className="bg-green-50 p-6 rounded-base border-2 border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h5 className="text-sm font-base text-green-800 mb-2">
              Ready to go!
            </h5>
            <p className="text-xs text-green-700">
              Your AI assistant is now active and will respond to WhatsApp
              messages automatically.
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
        <h4 className="text-sm font-base text-foreground mb-3">
          💡 While you wait:
        </h4>
        <ul className="text-xs text-foreground/70 space-y-2">
          <li>• The activation process is fully automated</li>
          <li>• You can safely close this page and return later</li>
          <li>• You&apos;ll receive an email confirmation when ready</li>
          <li>
            • Test your bot by sending a WhatsApp message to your new number
          </li>
        </ul>
      </div>
    </div>
  );
}
