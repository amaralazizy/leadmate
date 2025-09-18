import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start building your AI WhatsApp Bot"
    >
      <SignupForm />
    </AuthLayout>
  );
}