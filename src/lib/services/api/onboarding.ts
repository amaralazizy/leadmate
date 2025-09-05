import { AvailableNumber } from "@/components/onboarding/types";

// API service functions for onboarding
export const onboardingApi = {
  // Search for available phone numbers
  searchNumbers: async (country: string): Promise<AvailableNumber[]> => {
    const response = await fetch("/api/twilio/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to search numbers");
    }

    const data = await response.json();
    return data.numbers || [];
  },

  // Save business information
  saveBusinessInfo: async (businessData: {
    businessName: string;
    businessType: string;
    logoUrl: string;
    userId: string;
  }) => {

    // This would typically be handled by a dedicated API endpoint
    // For now, we'll use Supabase directly but wrapped in an API call
    const response = await fetch("/api/onboarding/business", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        business_name: businessData.businessName || "My Business",
        business_type: businessData.businessType || null,
        business_logo_url: businessData.logoUrl || null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save business information");
    }

    return response.json();
  },

  // Purchase and register phone number
  purchaseAndRegister: async (data: {
    userId: string;
    phoneNumber: string;
    businessName: string;
    logoUrl: string;
    webhookUrl: string;
  }) => {
    // Buy the phone number
    const buyResponse = await fetch("/api/twilio/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.userId,
        phoneNumber: data.phoneNumber,
      }),
    });

    if (!buyResponse.ok) {
      const errorData = await buyResponse.json();
      throw new Error(errorData.error || "Failed to buy number");
    }

    const buyResult = await buyResponse.json();

    // Register WhatsApp sender
    const profile = {
      name: data.businessName || "Business",
      about: "WhatsApp powered by Reply Pro",
      description: "Automated assistant",
      logo_url: data.logoUrl || undefined,
    };

    const registerResponse = await fetch("/api/twilio/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: data.userId,
        phoneNumber: data.phoneNumber,
        profile,
      }),
    });

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      throw new Error(errorData.error || "Failed to register sender");
    }

    const registerResult = await registerResponse.json();

    // Set webhook if phone SID is available
    if (buyResult.sid && data.webhookUrl) {
      await fetch("/api/twilio/set-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneSid: buyResult.sid,
          webhookUrl: data.webhookUrl,
        }),
      });
    }

    return {
      buyResult,
      registerResult,
      senderSid:
        registerResult?.sender?.sid ||
        registerResult?.sender?.url?.split("/").pop() ||
        "",
      activationStatus: registerResult?.sender?.status || "CREATING",
    };
  },

  // Check activation status
  checkActivationStatus: async (senderSid: string) => {
    const response = await fetch("/api/twilio/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderSid }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to check status");
    }

    const data = await response.json();
    return data.status;
  },

  // Update user's WhatsApp status in database
  updateWhatsAppStatus: async (data: {
    userId: string;
    status: string;
    phoneNumber?: string;
  }) => {
    const response = await fetch("/api/onboarding/whatsapp-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update WhatsApp status");
    }

    return response.json();
  },
};
