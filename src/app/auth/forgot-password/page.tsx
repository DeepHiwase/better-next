import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { ReturnButton } from "@/components/return-button";

export default function VerifySuccessPage() {
  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Success</h1>
      </div>

      <p className="text-muted-foreground">
        Please enter your email address to receive a password reset link.
      </p>

      <ForgotPasswordForm />
    </div>
  );
}
