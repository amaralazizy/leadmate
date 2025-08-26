"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/dashboard");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold ">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm">
          Access your AI WhatsApp Bot dashboard
        </p>
      </div>

      {/* <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-2 border-main py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-main">
              Login to your account
            </h3>
            <p className="text-sm text-main mt-1">
              Enter your email below to login to your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-main"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="text-main"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-main"
                >
                  Password
                </label>
                <Link
                  href="/auth/reset-password"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-main"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="text-main"
              />
            </div>

            <div className="space-y-3">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Login"}
              </Button>
              <Button variant="neutral" className="w-full" disabled>
                Login with Google
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="underline underline-offset-4 text-main hover:text-main/70"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div> */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="">Login to your account</CardTitle>
            <CardDescription className="">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    className="text-main"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="">
                      Password
                    </Label>
                    <Link
                      href="/auth/reset-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-main"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    className="text-main"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Signing in..." : "Login"}
              </Button>
              <Button variant="neutral" className="w-full" disabled={loading}>
                <FaGoogle className="w-4 h-4" />
                {loading ? "Signing in..." : "Login with Google"}
              </Button>
            </CardFooter>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="hover:underline underline-offset-4 text-main"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
