"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid session for password reset
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError(
          "Invalid or expired reset link. Please request a new password reset."
        );
      }
    };

    checkSession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className=" py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Password Updated!
            </h2>
            <p className="text-gray-600 mb-4">
              Your password has been successfully updated. You will be
              redirected to the login page shortly.
            </p>
            <Link
              href="login"
              className="text-green-600 hover:text-green-500 font-medium"
            >
              Go to login now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm">
          Enter your new password below
        </p>
      </div>

      <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium"
              >
                New Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-main disabled:cursor-not-allowed"
                  placeholder="Enter your new password"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm New Password
              </Label>
              <div className="mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-main disabled:cursor-not-allowed"
                  placeholder="Confirm your new password"
                />
              </div>
            </div>

            <div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-main">
                  Login
                </Link>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
