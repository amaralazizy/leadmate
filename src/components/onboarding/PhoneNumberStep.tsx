import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnboardingStepProps } from "./types";
import { COUNTRIES } from "./constants";
import { useSearchNumbers } from "@/hooks/useOnboarding";
import { Label } from "@/components/ui/label";
import { Phone, Search, Check, Globe } from "lucide-react";

export default function PhoneNumberStep({
  data,
  setData,
}: OnboardingStepProps) {
  const [availableNumbers, setAvailableNumbers] = useState<any[]>([]);
  const searchNumbersMutation = useSearchNumbers();

  const handleSearchNumbers = async () => {
    try {
      const numbers = await searchNumbersMutation.mutateAsync(
        data.selectedCountry
      );
      setAvailableNumbers(numbers);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-main rounded-base border-2 border-border shadow-shadow flex items-center justify-center mb-4">
          <Phone className="h-6 w-6 text-main-foreground" />
        </div>
        <h3 className="text-xl font-heading text-foreground mb-2">
          Pick a WhatsApp Number
        </h3>
        <p className="text-sm text-foreground/70">
          Choose a dedicated phone number for your WhatsApp business account
        </p>
      </div>

      <div className="space-y-6">
        {/* Country Selection */}
        <div className="space-y-3">
          <Label
            htmlFor="country"
            className="text-sm font-base text-foreground flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Country
          </Label>
          <select
            id="country"
            value={data.selectedCountry}
            onChange={(e) =>
              setData({ ...data, selectedCountry: e.target.value })
            }
            className="w-full h-9 px-3 py-1 text-base bg-transparent border border-input rounded-md shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            {COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-foreground/60">
            Select your country to find available WhatsApp numbers
          </p>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleSearchNumbers}
            disabled={searchNumbersMutation.isPending}
            variant="default"
            size="lg"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {searchNumbersMutation.isPending
              ? "Searching..."
              : "Search Available Numbers"}
          </Button>
        </div>

        {/* Available Numbers */}
        {availableNumbers.length > 0 && (
          <div className="space-y-4">
            <Label className="text-sm font-base text-foreground">
              Available Numbers <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableNumbers.map((number) => (
                <button
                  key={number.phoneNumber}
                  type="button"
                  onClick={() =>
                    setData({ ...data, selectedNumber: number.phoneNumber })
                  }
                  className={`relative text-left p-4 rounded-base border-2 transition-all duration-200 ${
                    data.selectedNumber === number.phoneNumber
                      ? "border-main bg-main/10 shadow-shadow"
                      : "border-border bg-secondary-background hover:border-main/50 hover:shadow-shadow"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-base text-foreground text-lg">
                        {number.phoneNumber}
                      </div>
                      <div className="text-xs text-foreground/60 mt-1">
                        {number.friendlyName || number.isoCountry}
                      </div>
                    </div>
                    {data.selectedNumber === number.phoneNumber && (
                      <Check className="h-5 w-5 text-main" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-foreground/60 text-center">
              Select a number to continue with your WhatsApp setup
            </p>
          </div>
        )}

        {/* Empty State */}
        {availableNumbers.length === 0 && !searchNumbersMutation.isPending && (
          <div className="text-center py-8 bg-secondary-background rounded-base border-2 border-border">
            <Phone className="h-12 w-12 text-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-foreground/70">
              Click "Search Available Numbers" to find WhatsApp numbers in your
              selected country
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-secondary-background p-6 rounded-base border-2 border-border">
        <h4 className="text-sm font-base text-foreground mb-3">
          📞 About WhatsApp Numbers:
        </h4>
        <ul className="text-xs text-foreground/70 space-y-2">
          <li>• This number will be your official WhatsApp Business number</li>
          <li>• Customers will see this number when they message you</li>
          <li>• The number comes with WhatsApp Business API access</li>
          <li>• Monthly cost varies by country (typically $15-50/month)</li>
        </ul>
      </div>
    </div>
  );
}
