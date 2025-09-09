"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import  Form from "next/form";
import { toast } from "sonner";

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
import { handleLogin } from "./action";
import { useActionState } from "react";

type Tstate = {
  success: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    supabase?: string[];
  };
  inputs: {
    email: string;
    password: string;
  };
};


export default function LoginPage() {
  const router = useRouter();

  async function loginAction(prevState: Tstate, formData: FormData) {
    toast.loading("Logging in...");
    const result = await handleLogin(prevState, formData);
    if (result.success) {
      toast.dismiss();
      toast.success("Logged in successfully");
      router.push("/dashboard");
    } else {
      toast.dismiss();
      toast.error("Failed to log in");
    }
    return result;
  }

  const [state, formAction, pending] = useActionState(loginAction, {
    success: false,
    errors: undefined,
    inputs: { email: "", password: "" },
  });

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

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="">Login to your account</CardTitle>
            <CardDescription className="">
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <Form className="space-y-6" action={formAction}>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="m@example.com"
                    required
                    defaultValue={state.inputs.email}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    //   setEmail(e.target.value)
                    // }
                    className="text-main disabled:cursor-not-allowed"
                    disabled={pending}
                  />
                  {state?.errors && !("supabase" in state.errors) && (
                    <div className="text-red-500">{state.errors.email}</div>
                  )}
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
                    name="password"
                    type="password"
                    required
                    defaultValue={state.inputs.password}
                    className="text-main disabled:cursor-not-allowed"
                    disabled={pending}
                  />
                  {state?.errors && !("supabase" in state.errors) && (
                    <div className="text-red-500">{state.errors.password}</div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              {state?.errors && "supabase" in state.errors && (
                <div className="text-red-500">{state.errors.supabase}</div>
              )}
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Logging in..." : "Login"}
              </Button>
              <Button variant="neutral" className="w-full" disabled={pending}>
                <FaGoogle className="w-4 h-4" />
                {pending ? "Logging in..." : "Login with Google"}
              </Button>
            </CardFooter>
          </Form>
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
