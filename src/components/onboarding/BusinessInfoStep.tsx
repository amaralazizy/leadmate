import { OnboardingStepProps } from "./types";
import { INDUSTRIES } from "./constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Image, Briefcase } from "lucide-react";

export default function BusinessInfoStep({
  data,
  setData,
}: OnboardingStepProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-main rounded-base border-2 border-border shadow-shadow flex items-center justify-center mb-4">
          <Building2 className="h-6 w-6 text-main-foreground" />
        </div>
        <h3 className="text-xl font-heading text-foreground mb-2">
          Tell us about your business
        </h3>
        <p className="text-sm text-foreground/70">
          Help us customize your AI assistant for your specific business needs
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div className="space-y-2">
          <Label
            htmlFor="businessName"
            className="text-sm font-base text-foreground"
          >
            Business Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="businessName"
            type="text"
            value={data.businessName}
            onChange={(e) => setData({ ...data, businessName: e.target.value })}
            placeholder="e.g. Acme Restaurant, Smith Law Firm"
            className="w-full"
          />
          <p className="text-xs text-foreground/60">
            This will be displayed to your customers in WhatsApp messages
          </p>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label
            htmlFor="industry"
            className="text-sm font-base text-foreground flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            Industry
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <select
              id="industry"
              value={data.businessType}
              onChange={(e) =>
                setData({ ...data, businessType: e.target.value })
              }
              className="w-full h-9 px-3 py-1 text-white bg-black border border-input rounded-md shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {INDUSTRIES.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-foreground/60">
            This helps us provide industry-specific suggestions
          </p>
        </div>

        {/* Logo URL */}
        <div className="space-y-2">
          <Label
            htmlFor="logoUrl"
            className="text-sm font-base text-foreground flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            Logo URL (optional)
          </Label>
          <Input
            id="logoUrl"
            type="url"
            value={data.logoUrl}
            onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
            className="w-full"
          />
          <p className="text-xs text-foreground/60">
            Add your business logo to personalize customer interactions
          </p>

          {/* Logo Preview */}
          {data.logoUrl && (
            <div className="mt-3 p-3 bg-secondary-background rounded-base border-2 border-border">
              <p className="text-xs text-foreground/70 mb-2">Preview:</p>
              <img
                src={data.logoUrl}
                alt="Logo preview"
                className="h-12 w-auto rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-secondary-background p-4 rounded-base border-2 border-border">
        <h4 className="text-sm font-base text-foreground mb-2">
          💡 Tips for success:
        </h4>
        <ul className="text-xs text-foreground/70 space-y-1">
          <li>• Use your official business name as customers know it</li>
          <li>• Choose the industry that best matches your primary services</li>
          <li>• A clear logo helps build trust with customers</li>
        </ul>
      </div>
    </div>
  );
}
