// components/auth/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  requireSubscription?: boolean;
  requireVerification?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  requireOnboarding = false,
  requireSubscription = false,
  requireVerification = false,
  redirectTo = "/login",
  allowedRoles = [],
}: ProtectedRouteProps) {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // No user = redirect to signin
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // // Check email verification requirement
    // if (requireVerification && !user.email_confirmed_at) {
    //   router.push("/auth/verify-email");
    //   return;
    // }

    // // Check onboarding requirement
    // if (requireOnboarding && !user.onboarding_completed_at) {
    //   const currentStep = user.onboarding_step || 1;
    //   router.push(`/onboarding?step=${currentStep}`);
    //   return;
    // }

    // Check subscription requirement
    if (
      requireSubscription &&
      !["active", "trial"].includes(user.subscription_status)
    ) {
      router.push("/billing?reason=subscription_required");
      return;
    }

    // Check role requirements
    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.subscription_status)
    ) {
      router.push("/unauthorized");
      return;
    }
  }, [
    user,
    loading,
    router,
    requireOnboarding,
    requireSubscription,
    requireVerification,
    allowedRoles,
    redirectTo,
  ]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => router.push("/auth/login")}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return null; // Will redirect
  }

  // All checks passed
  return <>{children}</>;
}
