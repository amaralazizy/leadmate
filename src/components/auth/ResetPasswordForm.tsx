"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Form from "next/form";
import { useActionState } from "react";
import { handleResetPassword } from "@/app/(auth)/reset-password/actions";
import { TresetPasswordFormPrevState } from "@/lib/schemas/resetPassword";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    TresetPasswordFormPrevState,
    FormData
  >(restPasswordAction, {
    success: false,
    errors: undefined,
    inputs: { email: "" },
  });

  async function restPasswordAction(
    prevState: TresetPasswordFormPrevState,
    formData: FormData
  ) {
    toast.loading("Resetting password...");
    const result = await handleResetPassword(prevState, formData);
    if (result.success) {
      toast.dismiss();
      toast.success("Password reset email sent successfully");
      setTimeout(() => {
        router.push("/");
      }, 5000);
    } else {
      toast.dismiss();
      toast.error("Failed to reset password");
    }
    return result;
  }

  if (state.success) {
    return (
      <div className="text-center p-4 bg-background">
        <p className="text-main font-semibold">
          ✅ Password reset email sent successfully!
        </p>
      </div>
    );
  }
  return (
    <section className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
          </CardDescription>
          {state.errors && "supabase" in state.errors && (
            <Alert variant="destructive">{state.errors.supabase}</Alert>
          )}
        </CardHeader>
        <Form className="space-y-6" action={formAction}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  defaultValue={state.inputs.email}
                />
                {state?.errors && !("supabase" in state.errors) && (
                  <div className="text-red-500">{state.errors.email}</div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Resetting password..." : "Reset password"}
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </section>
  );
}
