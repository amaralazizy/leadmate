"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, ArrowRight, Upload, Phone, MessageSquare } from "lucide-react";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface OnboardingData {
  businessType: string;
  whatsappNumber: string;
  knowledge: string;
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessType: "",
    whatsappNumber: "",
    knowledge: "",
  });
  const router = useRouter();

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      await completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Update user profile
      await supabase
        .from("users")
        .update({
          business_type: data.businessType,
          whatsapp_number: data.whatsappNumber,
        })
        .eq("id", user.id);

      // Upload knowledge if provided
      if (data.knowledge.trim()) {
        await fetch("/api/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: data.knowledge }),
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Business Details", icon: Phone },
    { number: 2, title: "Knowledge Base", icon: Upload },
    { number: 3, title: "Test Your Bot", icon: MessageSquare },
  ];

  return (
    // <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set up your AI Bot
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Just a few steps to get your WhatsApp bot ready
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      step >= s.number
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step > s.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      step >= s.number ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s.title}
                  </span>
                  {s.number < steps.length && (
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Step 1: Business Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Tell us about your business
                </h3>

                <div>
                  <label
                    htmlFor="businessType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    value={data.businessType}
                    onChange={(e) =>
                      setData({ ...data, businessType: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail">Retail Store</option>
                    <option value="service">Service Business</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    WhatsApp Business Number (Optional)
                  </label>
                  <input
                    id="whatsappNumber"
                    type="tel"
                    value={data.whatsappNumber}
                    onChange={(e) =>
                      setData({ ...data, whatsappNumber: e.target.value })
                    }
                    placeholder="+1234567890"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can add this later in settings
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Knowledge Base */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Add your business knowledge
                </h3>

                <div>
                  <label
                    htmlFor="knowledge"
                    className="block text-sm font-medium text-gray-700"
                  >
                    FAQ, Menu, or Business Information
                  </label>
                  <textarea
                    id="knowledge"
                    rows={8}
                    value={data.knowledge}
                    onChange={(e) =>
                      setData({ ...data, knowledge: e.target.value })
                    }
                    placeholder="Enter your frequently asked questions, menu items, business hours, services, etc..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This helps your AI provide accurate responses to customers
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Tip:</strong> Include information about your
                    products, services, pricing, business hours, and common
                    customer questions.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Test */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  You&apos;re all set!
                </h3>

                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-md">
                    <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-green-700">
                      Your AI WhatsApp bot is ready to use!
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>Next steps:</p>
                    <ul className="text-left space-y-1">
                      <li>• Test your bot in the dashboard</li>
                      <li>• Connect your Twilio WhatsApp number</li>
                      <li>• Start receiving customer messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={loading || (step === 1 && !data.businessType)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Setting up..."
                  : step === 3
                  ? "Complete Setup"
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    // </ProtectedRoute>
  );
}
