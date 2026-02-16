import { ReturnButton } from "@/components/return-button";

export default function ForgotPasswordSuccessPage() {
  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Success</h1>
      </div>

      <p className="text-muted-foreground">
        Success! You have sent a password reset link to your email.
      </p>
    </div>
  );
}
