// Utility functions for auth operations
// These are pure functions that can be used anywhere in the app

export interface UserProfile {
  id: string;
  email: string;
  business_name: string;
  business_type: string;
  whatsapp_number: string;
  whatsapp_connected: boolean;
  subscription_status: string;
  onboarding_completed_at: string | null;
  onboarding_step: number;
  monthly_message_quota: number;
  messages_used_this_month: number;
}

export const authUtils = {
  // Update profile without DB call (for immediate UI updates)
  updateProfileLocally: (updates: Partial<UserProfile>) => {
    // This would be called from the useAuth hook
    // Used for optimistic updates
    return updates;
  },

  // Only call when you need fresh data (after critical operations)
  async forceRefreshProfile() {
    // This would trigger a profile refresh
    // Implementation depends on the auth context
    console.log("Force refresh profile called");
  },

  // Increment message count locally (sync to DB periodically)
  incrementMessageCount: (currentCount: number) => {
    return currentCount + 1;
  },

  // Check if user has active subscription
  hasActiveSubscription: (subscriptionStatus: string) => {
    return ["active", "trial"].includes(subscriptionStatus);
  },

  // Check if user has completed onboarding
  hasCompletedOnboarding: (onboardingCompletedAt: string | null) => {
    return onboardingCompletedAt !== null;
  },

  // Check if user is verified
  isEmailVerified: (emailConfirmedAt: string | null) => {
    return emailConfirmedAt !== null;
  },

  // Format user display name
  getDisplayName: (profile: UserProfile | null) => {
    if (!profile) return "User";
    return profile.business_name || profile.email;
  },

  // Check if user can access premium features
  canAccessPremium: (subscriptionStatus: string) => {
    return subscriptionStatus === "active";
  },

  // Check if user is in trial
  isInTrial: (subscriptionStatus: string) => {
    return subscriptionStatus === "trial";
  },

  // Check if user has exceeded message quota
  hasExceededQuota: (used: number, limit: number) => {
    return used >= limit;
  },

  // Get remaining messages
  getRemainingMessages: (used: number, limit: number) => {
    return Math.max(0, limit - used);
  },
};
