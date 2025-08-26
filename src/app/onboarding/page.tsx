"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  Check,
  ArrowRight,
  Upload,
  Phone,
  MessageSquare,
  Globe,
} from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface OnboardingData {
  businessName: string;
  industry: string;
  logoUrl: string;
  selectedCountry: string;
  selectedNumber: string;
  senderSid: string;
  activationStatus: string;
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessName: "",
    industry: "",
    logoUrl: "",
    selectedCountry: "US",
    selectedNumber: "",
    senderSid: "",
    activationStatus: "PENDING",
  });
  const router = useRouter();

  const [availableNumbers, setAvailableNumbers] = useState<
    {
      phoneNumber: string;
      friendlyName?: string | null;
      isoCountry?: string | null;
      capabilities?: any;
    }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const webhookUrl = useMemo(() => {
    // Use environment variable if available, otherwise fallback to window.location
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    return `${baseUrl}/api/twilio/webhook`;
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      await saveBusinessInfo();
      setStep(2);
      return;
    }
    if (step === 2) {
      await purchaseAndRegister();
      setStep(3);
      return;
    }
    if (step === 3) {
      await completeOnboarding();
      return;
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to complete onboarding", {
        description: error as string,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBusinessInfo = async () => {
    setLoading(true);
    try {
      await supabase
        .from("users")
        .update({
          business_name: data.businessName || "My Business",
          business_type: data.industry || null,
          business_logo_url: data.logoUrl || null,
        })
        .eq("id", user?.id);
    } catch (e) {
      toast.error("Failed to save business info", {
        description: e as string,
      });
    } finally {
      setLoading(false);
    }
  };

  const searchNumbers = async () => {
    setSearching(true);
    try {
      const res = await fetch("/api/twilio/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: data.selectedCountry }),
      });
      const json = await res.json();

      if (res.ok) setAvailableNumbers(json.numbers || []);
      else {
        if (json.error.includes("was not found"))
          toast.error("No available numbers", {
            description: "Please try a different country",
          });
        else toast.error(json.error);
        setAvailableNumbers([]);
      }
    } catch (e) {
      toast.error("Failed to search numbers", {
        description: e as string,
      });
      setAvailableNumbers([]);
    } finally {
      setSearching(false);
    }
  };

  const purchaseAndRegister = async () => {
    setLoading(true);
    try {
      // Buy number
      const buyRes = await fetch("/api/twilio/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          phoneNumber: data.selectedNumber,
        }),
      });
      const buyJson = await buyRes.json();
      if (!buyRes.ok) throw new Error(buyJson.error || "Failed to buy number");

      // Register WhatsApp Sender
      const profile = {
        name: data.businessName || "Business",
        about: "WhatsApp powered by Reply Pro",
        description: "Automated assistant",
        logo_url: data.logoUrl || undefined,
      } as any;

      const regRes = await fetch("/api/twilio/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          phoneNumber: data.selectedNumber,
          profile,
        }),
      });
      const regJson = await regRes.json();
      if (!regRes.ok)
        throw new Error(regJson.error || "Failed to register sender");

      const senderSid =
        regJson?.sender?.sid || regJson?.sender?.url?.split("/").pop() || "";

      // Save sender SID + status
      await supabase
        .from("users")
        .update({
          twilio_sender_sid: senderSid,
          whatsapp_status: regJson?.sender?.status || "CREATING",
        })
        .eq("id", user?.id);

      setData((d) => ({
        ...d,
        senderSid,
        activationStatus: regJson?.sender?.status || "CREATING",
      }));

      // Set Webhook on purchased number
      if (buyJson.sid) {
        await fetch("/api/twilio/set-webhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneSid: buyJson.sid, webhookUrl }),
        });
      }
    } catch (e) {
      // toast.error("Failed to purchase number", {
      //   description: e as string,
      // });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (step === 3 && data.senderSid) {
      interval = setInterval(async () => {
        try {
          const res = await fetch("/api/twilio/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderSid: data.senderSid }),
          });
          const json = await res.json();
          if (res.ok) {
            setData((d) => ({ ...d, activationStatus: json.status }));
            if (json.status === "ONLINE") {
              const { data: userData } = await supabase.auth.getUser();
              const uid = userData?.user?.id;
              if (uid) {
                await supabase
                  .from("users")
                  .update({
                    whatsapp_status: "ONLINE",
                    whatsapp_number: data.selectedNumber,
                  })
                  .eq("id", uid);
              }
              clearInterval(interval);
            }
          }
        } catch (e) {
          toast.error("Failed to check status", {
            description: e as string,
          });
        }
      }, 5000);
    }
    return () => interval && clearInterval(interval);
  }, [step, data.senderSid, data.selectedNumber, supabase]);

  // Fetch existing user data and determine starting step
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || initialized) return;

      try {
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          toast.error("Failed to fetch user data", {
            description: error.message,
          });
          return;
        }

        if (userData) {
          const updatedData = { ...data };
          let startingStep = 1;

          // Check business info
          if (userData.business_name && userData.business_type) {
            updatedData.businessName = userData.business_name;
            updatedData.industry = userData.business_type;
            updatedData.logoUrl = userData.business_logo_url || "";
            startingStep = 2;
          }

          // Check if number is selected
          if (userData.twilio_phone_number) {
            updatedData.selectedNumber = userData.twilio_phone_number;
            startingStep = 3;
          }

          // Check if WhatsApp is activated
          if (userData.whatsapp_status === "ONLINE") {
            updatedData.activationStatus = "ONLINE";
            startingStep = 4;
          } else if (userData.twilio_sender_sid) {
            updatedData.senderSid = userData.twilio_sender_sid;
            updatedData.activationStatus =
              userData.whatsapp_status || "CREATING";
            startingStep = 3;
          }

          setData(updatedData);
          setStep(startingStep);
        }
      } catch (error) {
        toast.error("Failed to initialize onboarding", {
          description: error as string,
        });
      } finally {
        setInitialized(true);
      }
    };

    fetchUserData();
  }, [user, initialized, data, supabase]);

  const steps = [
    { number: 1, title: "Business Info", icon: Phone },
    { number: 2, title: "Pick WhatsApp Number", icon: Globe },
    { number: 3, title: "Activate", icon: Upload },
    { number: 4, title: "Done", icon: MessageSquare },
  ];

  // Show loading while fetching user data
  if (!initialized) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-600">
                  Loading your setup...
                </p>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
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
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
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
            {/* Step 1: Business Info */}
            {step === 1 && (
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
                    onChange={(e) =>
                      setData({ ...data, businessName: e.target.value })
                    }
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
                    onChange={(e) =>
                      setData({ ...data, industry: e.target.value })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your industry</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="retail">Retail</option>
                    <option value="service">Service</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
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
                    onChange={(e) =>
                      setData({ ...data, logoUrl: e.target.value })
                    }
                    placeholder="https://.../logo.png"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Pick Number */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Pick a WhatsApp Number
                </h3>

                {/* Show selected number if already exists */}
                {data.selectedNumber && (
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm text-green-700">
                      <strong>Selected:</strong> {data.selectedNumber}
                    </p>
                  </div>
                )}
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
                      <option value="US">United States</option>
                      <option value="EG">Egypt</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="GB">United Kingdom</option>
                      <option value="SA">Saudi Arabia</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={searchNumbers}
                      disabled={searching}
                      className="px-3 py-2 mx-auto text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {searching ? "Searching..." : "Search Numbers"}
                    </button>
                  </div>

                  {availableNumbers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[300px]">
                      {availableNumbers.map((n) => (
                        <button
                          key={n.phoneNumber}
                          type="button"
                          onClick={() =>
                            setData({ ...data, selectedNumber: n.phoneNumber })
                          }
                          className={`text-left border rounded-md p-3 hover:border-blue-500 ${
                            data.selectedNumber === n.phoneNumber
                              ? "border-blue-600"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="font-medium">{n.phoneNumber}</div>
                          <div className="text-xs text-gray-500">
                            {n.friendlyName || n.isoCountry}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Activate */}
            {step === 3 && (
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
                    <p>
                      This may take a few minutes. You can keep this page open.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Done */}
            {step === 4 && (
              <div className="space-y-6 text-center">
                <h3 className="text-lg font-medium text-gray-900">
                  You&apos;re all set!
                </h3>
                <div className="bg-green-50 p-4 rounded-md">
                  <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-700">
                    Your WhatsApp bot is active.
                  </p>
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
                disabled={
                  loading ||
                  (step === 1 && !data.businessName) ||
                  (step === 2 && !data.selectedNumber) ||
                  (step === 3 && data.activationStatus !== "ONLINE")
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Working..."
                  : step === 3
                  ? data.activationStatus === "ONLINE"
                    ? "Complete Setup"
                    : "Activating..."
                  : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
