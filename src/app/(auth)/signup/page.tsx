"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { handleSignup, SignupFormData } from "@/actions";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(handleSignup, {
    success: false,
    errors: undefined,
    inputs: {
      email: "",
      password: "",
      businessName: "",
      username: "",
    },
  });

  // Show verification modal when signup is successful
  useEffect(() => {
    if (state.success && state.needsVerification) {
      // The modal will be shown based on state.success && state.needsVerification
    }
  }, [state.success, state.needsVerification]);

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
              <form className="space-y-6" action={formAction}>
                {/* Display server errors */}
                {state.errors?.supabase && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {state.errors.supabase.join(", ")}
                  </div>
                )}

                <div>
                  <Label
                    htmlFor="businessName"
                    className="block text-sm font-medium"
                  >
                    Business Name
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      defaultValue={state.inputs.businessName}
                      placeholder="Your Business Name"
                    />
                    {state.errors?.businessName && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.businessName.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="username"
                    className="block text-sm font-medium"
                  >
                    Username
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      defaultValue={state.inputs.username}
                      placeholder="Choose a username"
                    />
                    {state.errors?.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.username.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium">
                    Email address
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Your Email"
                      required
                      defaultValue={state.inputs.email}
                    />
                    {state.errors?.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.email.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="password"
                    className="block text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      defaultValue={state.inputs.password}
                      placeholder="Minimum 6 characters"
                    />
                    {state.errors?.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {state.errors.password.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center py-2 px-4 text-sm font-medium"
                  >
                    {isPending ? "Creating account..." : "Create account"}
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
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {state.success && state.needsVerification && (
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
                  <strong>{state.inputs.email}</strong>. Please check your inbox
                  and click the verification link to complete your registration.
                </p>
              </div>

              <div className="mt-3">
                <p className="text-xs text-main flex flex-col gap-2">
                  <span>Didn&apos;t receive the email?</span>
                  Check your spam folder or
                  <Link href="/signup">
                    <Button variant="neutral">Try signing up again</Button>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
