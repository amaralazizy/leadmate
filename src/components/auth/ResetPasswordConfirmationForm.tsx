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
import { handleResetPasswordConfirmation } from "@/app/(auth)/reset-password-confirmation/actions";
import { TresetPasswordConfirmationFormPrevState } from "@/lib/schemas/resetPasswordConfirmation";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordConfirmationForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    TresetPasswordConfirmationFormPrevState,
    FormData
  >(restPasswordConfirmationAction, {
    success: false,
    errors: undefined,
    inputs: { password: "", confirmPassword: "" },
  });

  async function restPasswordConfirmationAction(
    prevState: TresetPasswordConfirmationFormPrevState,
    formData: FormData
  ) {
    toast.loading("Resetting password...");
    const result = await handleResetPasswordConfirmation(prevState, formData);
    if (result.success) {
      toast.dismiss();
      toast.success("Password reset successfully");
      router.push("/login");
    } else {
      toast.dismiss();
      toast.error("Failed to reset password");
    }
    return result;
  }

  if (state.success) {
    return (
      <div className="text-center p-4 bg-background border border-border rounded-lg">
        <p className="text-main font-semibold">
          ✅ Password reset successfully!
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
            Enter your new password below to reset your password
          </CardDescription>
          {state.errors && "supabase" in state.errors && (
            <Alert variant="destructive">{state.errors.supabase}</Alert>
          )}
        </CardHeader>
        <Form className="space-y-6" action={formAction}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your
                password"
                  name="password"
                  defaultValue={state.inputs.password}
                />
                {state?.errors && !("supabase" in state.errors) && (
                  <div className="text-red-500">{state.errors.email}</div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Enter your confirm password"
                  name="confirmPassword"
                  defaultValue={state.inputs.confirmPassword}
                />
              </div>
              {state?.errors && !("supabase" in state.errors) && (
                <div className="text-red-500">
                  {state.errors.confirmPassword}
                </div>
              )}
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
