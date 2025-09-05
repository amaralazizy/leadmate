import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onboardingApi } from "@/lib/services/api/onboarding";
import { AvailableNumber } from "@/components/onboarding/types";
import { toast } from "sonner";

// Query keys for caching
export const onboardingKeys = {
  all: ["onboarding"] as const,
  numbers: (country: string) =>
    [...onboardingKeys.all, "numbers", country] as const,
  status: (senderSid: string) =>
    [...onboardingKeys.all, "status", senderSid] as const,
};

// Hook for searching phone numbers
export function useSearchNumbers() {
  return useMutation({
    mutationFn: onboardingApi.searchNumbers,
    onError: (error: Error) => {
      toast.error(error.message || "Failed to search numbers");
    },
  });
}

// Hook for saving business information
export function useSaveBusinessInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.saveBusinessInfo,
    onSuccess: () => {
      toast.success("Business information saved successfully");
      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save business information");
    },
  });
}

// Hook for purchasing and registering phone number
export function usePurchaseAndRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.purchaseAndRegister,
    onSuccess: () => {
      toast.success("Phone number purchased and registered successfully");
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to purchase and register number");
    },
  });
}

// Hook for checking activation status with polling
export function useActivationStatus(
  senderSid: string | null,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: onboardingKeys.status(senderSid || ""),
    queryFn: () => onboardingApi.checkActivationStatus(senderSid!),
    enabled: enabled && !!senderSid,
    refetchInterval: (data) => {
      // Stop polling if status is ONLINE or FAILED
      return data === "ONLINE" || data === "FAILED" ? false : 5000;
    },
    refetchIntervalInBackground: true,
    onError: (error: Error) => {
      console.error("Failed to check activation status:", error);
    },
  });
}

// Hook for updating WhatsApp status
export function useUpdateWhatsAppStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: onboardingApi.updateWhatsAppStatus,
    onSuccess: () => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: Error) => {
      console.error("Failed to update WhatsApp status:", error);
    },
  });
}

// Convenience hook that combines all onboarding mutations
export function useOnboardingMutations() {
  const searchNumbers = useSearchNumbers();
  const saveBusinessInfo = useSaveBusinessInfo();
  const purchaseAndRegister = usePurchaseAndRegister();
  const updateWhatsAppStatus = useUpdateWhatsAppStatus();

  return {
    searchNumbers,
    saveBusinessInfo,
    purchaseAndRegister,
    updateWhatsAppStatus,
    isLoading:
      searchNumbers.isPending ||
      saveBusinessInfo.isPending ||
      purchaseAndRegister.isPending ||
      updateWhatsAppStatus.isPending,
  };
}
