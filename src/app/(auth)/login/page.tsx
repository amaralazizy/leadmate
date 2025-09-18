import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Login to your account"
      description="Access your AI WhatsApp Bot dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
} 