"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  // const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Show verification modal instead of redirecting immediately
      setShowVerificationModal(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleContinueToOnboarding = () => {
  //   setShowVerificationModal(false);
  //   router.push("/onboarding");
  // };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm">
          Start building your AI WhatsApp Bot
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="">Create your account</CardTitle>
              <CardDescription className="">
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="businessName"
                className="block text-sm font-medium"
              >
                Business Name
              </label>
              <div className="mt-1">
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Business Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4  text-sm font-medium"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-main hover:text-main/80"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-background overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-border w-96 shadow-lg rounded-md bg-background">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-main">
                <svg
                  className="h-6 w-6 text-main-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-main mt-4">
                Check your email
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-main">
                  We&apos;ve sent a verification email to{" "}
                  <strong>{email}</strong>. Please check your inbox and click
                  the verification link to complete your registration.
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs text-main flex flex-col gap-2">
                  <span>Didn&apos;t receive the email?</span>
                  Check your spam folder or
                  <Button onClick={() => setShowVerificationModal(false)}>
                    try signing up again
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
