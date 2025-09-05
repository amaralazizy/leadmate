import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnboardingStepProps } from "./types";
import { COUNTRIES } from "./constants";
import { useSearchNumbers } from "@/hooks/useOnboarding";

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
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Pick a WhatsApp Number
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <select
            id="country"
            value={data.selectedCountry}
            onChange={(e) =>
              setData({ ...data, selectedCountry: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {COUNTRIES.map((country) => (
              <option key={country.value} value={country.value}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleSearchNumbers}
            disabled={searchNumbersMutation.isPending}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {searchNumbersMutation.isPending
              ? "Searching..."
              : "Search Numbers"}
          </Button>
        </div>

        {availableNumbers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {availableNumbers.map((number) => (
              <Button
                key={number.phoneNumber}
                type="button"
                onClick={() =>
                  setData({ ...data, selectedNumber: number.phoneNumber })
                }
                className={`text-left border rounded-md p-3 hover:border-blue-500 ${
                  data.selectedNumber === number.phoneNumber
                    ? "border-blue-600"
                    : "border-gray-200"
                }`}
              >
                <div className="font-medium">{number.phoneNumber}</div>
                <div className="text-xs text-gray-500">
                  {number.friendlyName || number.isoCountry}
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
