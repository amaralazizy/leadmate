"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/services/supabase/client";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  OnboardingProgress,
  BusinessInfoStep,
  PhoneNumberStep,
  ActivationStep,
  CompletionStep,
  OnboardingNavigation,
  type OnboardingData,
  INITIAL_ONBOARDING_DATA,
} from "@/components/onboarding";
import {
  useOnboardingMutations,
  useActivationStatus,
  useUpdateWhatsAppStatus,
} from "@/hooks/useOnboarding";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const router = useRouter();

  const {
    saveBusinessInfo,
    purchaseAndRegister,
    isLoading: mutationsLoading,
  } = useOnboardingMutations();

  const updateWhatsAppStatus = useUpdateWhatsAppStatus();

  // Use polling query for activation status
  const { data: activationStatus, isLoading: statusLoading } =
    useActivationStatus(data.senderSid, step === 3 && !!data.senderSid);

  const webhookUrl = useMemo(() => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/api/twilio/webhook`;
    }
    return "/api/twilio/webhook"; // Fallback for SSR
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      await handleSaveBusinessInfo();
      return;
    }
    if (step === 2) {
      await handlePurchaseAndRegister();
      return;
    }
    if (step === 3) {
      await completeOnboarding();
      return;
    }
  };

  const completeOnboarding = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  const handleSaveBusinessInfo = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user){ 
        router.push("/login");
        return;
      }

      await saveBusinessInfo.mutateAsync({
        businessName: data.businessName,
        businessType: data.businessType,
        logoUrl: data.logoUrl,
        userId: user.id,
      });
      setStep(2);
    } catch (error) {
      console.error("Failed to save business info:", error);
    }
  };

  const handlePurchaseAndRegister = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const result = await purchaseAndRegister.mutateAsync({
        userId: user.id,
        phoneNumber: data.selectedNumber,
        businessName: data.businessName,
        logoUrl: data.logoUrl,
        webhookUrl,
      });

      // Update local state with the result
      setData((d) => ({
        ...d,
        senderSid: result.senderSid,
        activationStatus: result.activationStatus,
      }));

      // Save sender SID + status to database
      await supabase
        .from("users")
        .update({
          twilio_sender_sid: result.senderSid,
          whatsapp_status: result.activationStatus,
        })
        .eq("id", user.id);

      setStep(3);
    } catch (error) {
      console.error("Failed to purchase and register:", error);
    }
  };

  // Update activation status when polling query returns new data
  useEffect(() => {
    if (activationStatus && activationStatus !== data.activationStatus) {
      setData((d) => ({ ...d, activationStatus: activationStatus as string }));

      // If status is ONLINE, update the database
      if (activationStatus === "ONLINE") {
        const updateStatus = async () => {
          const { data: userData } = await supabase.auth.getUser();
          const uid = userData?.user?.id;
          if (uid) {
            await updateWhatsAppStatus.mutateAsync({
              userId: uid,
              status: "ONLINE",
              phoneNumber: data.selectedNumber,
            });
          }
        };
        updateStatus();
      }
    }
  }, [
    activationStatus,
    data.activationStatus,
    data.selectedNumber,
    updateWhatsAppStatus,
  ]);

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
      <OnboardingProgress currentStep={step} />

      {/* Step Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Render step content based on current step */}
          {step === 1 && <BusinessInfoStep data={data} setData={setData} />}
          {step === 2 && <PhoneNumberStep data={data} setData={setData} />}
          {step === 3 && <ActivationStep data={data} setData={setData} />}
          {step === 4 && <CompletionStep />}

          {/* Navigation */}
          <OnboardingNavigation
            step={step}
            loading={mutationsLoading || statusLoading}
            data={data}
            onNext={handleNext}
            onBack={() => setStep(step - 1)}
          />
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
