import {
  Check,
  MessageSquare,
  BarChart3,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CompletionStep() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-main rounded-base border-2 border-border shadow-shadow flex items-center justify-center mb-6">
          <Check className="h-8 w-8 text-main-foreground" />
        </div>
        <h3 className="text-2xl font-heading text-foreground mb-3">
          🎉 You&apos;re All Set!
        </h3>
        <p className="text-foreground/70 max-w-md mx-auto">
          Your AI-powered WhatsApp assistant is now active and ready to help
          your customers 24/7.
        </p>
      </div>

      {/* Success Card */}
      <div className="bg-green-50 p-6 rounded-base border-2 border-green-200">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MessageSquare className="h-6 w-6 text-green-600" />
          <span className="text-lg font-heading text-green-800">
            WhatsApp Bot Active
          </span>
        </div>
        <p className="text-sm text-green-700 text-center">
          Your customers can now message your WhatsApp number and receive
          instant AI-powered responses.
        </p>
      </div>

      {/* Next Steps */}
      <div className="space-y-4">
        <h4 className="text-lg font-heading text-foreground text-center">
          What&apos;s Next?
        </h4>

        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 bg-secondary-background rounded-base border-2 border-border">
            <div className="w-8 h-8 bg-main rounded-base border border-border flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-4 w-4 text-main-foreground" />
            </div>
            <div>
              <h5 className="text-sm font-base text-foreground mb-1">
                Monitor Conversations
              </h5>
              <p className="text-xs text-foreground/70">
                View and manage all customer conversations from your dashboard
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary-background rounded-base border-2 border-border">
            <div className="w-8 h-8 bg-main rounded-base border border-border flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-4 w-4 text-main-foreground" />
            </div>
            <div>
              <h5 className="text-sm font-base text-foreground mb-1">
                Track Performance
              </h5>
              <p className="text-xs text-foreground/70">
                See analytics on response times, customer satisfaction, and more
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-secondary-background rounded-base border-2 border-border">
            <div className="w-8 h-8 bg-main rounded-base border border-border flex items-center justify-center flex-shrink-0">
              <Settings className="h-4 w-4 text-main-foreground" />
            </div>
            <div>
              <h5 className="text-sm font-base text-foreground mb-1">
                Customize Settings
              </h5>
              <p className="text-xs text-foreground/70">
                Fine-tune your AI responses and business preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Your Bot */}
      <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
        <h4 className="text-sm font-base text-foreground mb-3">
          🚀 Test Your Bot:
        </h4>
        <ol className="text-xs text-foreground/70 space-y-2">
          <li>1. Send a WhatsApp message to your new business number</li>
          <li>2. Ask a question about your business</li>
          <li>3. Watch your AI assistant respond instantly!</li>
        </ol>
      </div>
    </div>
  );
}
