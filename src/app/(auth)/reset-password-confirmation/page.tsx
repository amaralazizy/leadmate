import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordConfirmationForm from "@/components/auth/ResetPasswordConfirmationForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email below to reset your password"
    >
      <ResetPasswordConfirmationForm />
    </AuthLayout>
  );
}
