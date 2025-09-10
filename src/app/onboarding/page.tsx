"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Bot, Sparkles } from "lucide-react";
// import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  OnboardingProgress,
  BusinessInfoStep,
  KnowledgeUploadStep,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_ONBOARDING_DATA);
  const router = useRouter();

  const {
    saveBusinessInfo,
    uploadKnowledge,
    purchaseAndRegister,
    isLoading: mutationsLoading,
  } = useOnboardingMutations();

  const updateWhatsAppStatus = useUpdateWhatsAppStatus();

  // Use polling query for activation status
  const { data: activationStatus, isLoading: statusLoading } =
    useActivationStatus(data.senderSid, step === 4 && !!data.senderSid);

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
      await handleUploadKnowledge();
      return;
    }
    if (step === 3) {
      await handlePurchaseAndRegister();
      return;
    }
    if (step === 4) {
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
      if (!user) {
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

  const handleUploadKnowledge = async () => {
    try {
      // Knowledge content is required
      if (!data.knowledgeContent?.trim()) {
        return; // Button should be disabled, but just in case
      }

      await uploadKnowledge.mutateAsync(data.knowledgeContent);
      setStep(3);
    } catch (error) {
      console.error("Failed to upload knowledge:", error);
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

      setStep(4);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b-2 border-border bg-secondary-background">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-main rounded-base border-2 border-border shadow-shadow">
                <Bot className="h-6 w-6 text-main-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-heading text-foreground">
                  ReplyPro Setup
                </h1>
                <p className="text-sm text-foreground/70">
                  Configure your AI WhatsApp assistant
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <Sparkles className="h-4 w-4" />
              Step {step} of 5
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <OnboardingProgress currentStep={step} />

        {/* Step Content */}
        <div className="mt-8">
          <Card className="max-w-2xl mx-auto transition-all duration-300 ease-in-out">
            <CardContent className="p-8">
              {/* Render step content based on current step with fade transitions */}
              <div className="transition-all duration-500 ease-in-out">
                {step === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <BusinessInfoStep data={data} setData={setData} />
                  </div>
                )}
                {step === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <KnowledgeUploadStep data={data} setData={setData} />
                  </div>
                )}
                {step === 3 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <PhoneNumberStep data={data} setData={setData} />
                  </div>
                )}
                {step === 4 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <ActivationStep data={data} setData={setData} />
                  </div>
                )}
                {step === 5 && (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <CompletionStep />
                  </div>
                )}
              </div>

              {/* Navigation */}
              <OnboardingNavigation
                step={step}
                loading={mutationsLoading || statusLoading}
                data={data}
                onNext={handleNext}
                onBack={() => setStep(step - 1)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
