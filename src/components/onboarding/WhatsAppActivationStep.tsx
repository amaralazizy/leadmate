import { OnboardingStepProps } from "./types";
import {
  MessageCircle,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const WHATSAPP_NUMBER = "+201093200715";

export default function WhatsAppActivationStep({
  data,
  setData,
}: OnboardingStepProps) {
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(WHATSAPP_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy number:", err);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Hi, I'd like to activate my chatbot access. My business name is: " +
        data.businessName
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(
      "+",
      ""
    )}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-500 rounded-base border-2 border-border shadow-shadow flex items-center justify-center mb-4">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-heading text-foreground mb-2">
          Activate Your WhatsApp Access
        </h3>
        <p className="text-sm text-foreground/70">
          Send a message to our WhatsApp number to activate your chatbot
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-base p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800 mb-1">
              ⚠️ Important: Manual Activation Required
            </h4>
            <p className="text-xs text-amber-700">
              You <strong>will NOT have access</strong> to your chatbot number
              unless you message us on WhatsApp first. This is a required
              security step to verify your identity and activate your account.
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Number Card */}
      <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-foreground mb-2">
            WhatsApp Activation Number
          </h4>
          <div className="bg-background p-4 rounded-base border-2 border-border mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-lg sm:text-2xl font-mono text-foreground break-all sm:break-normal text-center sm:text-left">
                {WHATSAPP_NUMBER}
              </span>
              <Button
                variant="neutral"
                size="sm"
                onClick={copyNumber}
                className="flex items-center gap-2 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <Button
            onClick={openWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">
            📱 Follow these steps:
          </h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-secondary-background rounded-base border-2 border-border">
              <div className="w-8 h-8 bg-main rounded-base border border-border flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-main-foreground">
                  1
                </span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-foreground mb-1">
                  Copy the WhatsApp number
                </h5>
                <p className="text-xs text-foreground/70">
                  Use the copy button above or manually copy:{" "}
                  <strong>{WHATSAPP_NUMBER}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary-background rounded-base border-2 border-border">
              <div className="w-8 h-8 bg-main rounded-base border border-border flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-main-foreground">
                  2
                </span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-foreground mb-1">
                  Send a WhatsApp message
                </h5>
                <p className="text-xs text-foreground/70">
                  Message us with your business name: "
                  <strong>{data.businessName}</strong>" to activate your chatbot
                  access
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-secondary-background rounded-base border-2 border-border">
              <div className="w-8 h-8 bg-main rounded-base border border-border flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-main-foreground">
                  3
                </span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-foreground mb-1">
                  Wait for confirmation
                </h5>
                <p className="text-xs text-foreground/70">
                  We'll respond within minutes to confirm your chatbot is
                  activated
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-base p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800 mb-1">
                What happens after activation?
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  • Your chatbot will be connected to your business WhatsApp
                  number
                </li>
                <li>• Customers can start messaging your business</li>
                <li>
                  • Your AI assistant will respond automatically using your
                  knowledge base
                </li>
                <li>
                  • You'll receive access to the dashboard to monitor
                  conversations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Help section */}
      <div className="text-center text-xs text-foreground/60">
        <p>
          Having trouble? Make sure you're messaging from WhatsApp (not WhatsApp
          Business) and include your business name in the message.
        </p>
      </div>

      {/* Confirmation */}
      <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="whatsapp-confirmation"
            checked={data.whatsappActivated}
            onChange={(e) =>
              setData({ ...data, whatsappActivated: e.target.checked })
            }
            className="mt-1 h-4 w-4 text-main focus:ring-main border-border rounded"
          />
          <div className="flex-1">
            <Label
              htmlFor="whatsapp-confirmation"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              ✅ I have sent a WhatsApp message to {WHATSAPP_NUMBER}
            </Label>
            <p className="text-xs text-foreground/70 mt-1">
              Check this box after you've successfully sent the WhatsApp message
              with your business name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
