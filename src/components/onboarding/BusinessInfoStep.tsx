import { OnboardingStepProps } from "./types";
import { INDUSTRIES } from "./constants";

export default function BusinessInfoStep({
  data,
  setData,
}: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Tell us about your business
      </h3>

      <div>
        <label
          htmlFor="businessName"
          className="block text-sm font-medium text-gray-700"
        >
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          value={data.businessName}
          onChange={(e) => setData({ ...data, businessName: e.target.value })}
          placeholder="Acme Co."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-700"
        >
          Industry
        </label>
        <select
          id="industry"
          value={data.industry}
          onChange={(e) => setData({ ...data, industry: e.target.value })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {INDUSTRIES.map((industry) => (
            <option key={industry.value} value={industry.value}>
              {industry.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="logoUrl"
          className="block text-sm font-medium text-gray-700"
        >
          Logo URL (optional)
        </label>
        <input
          id="logoUrl"
          type="url"
          value={data.logoUrl}
          onChange={(e) => setData({ ...data, logoUrl: e.target.value })}
          placeholder="https://.../logo.png"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
