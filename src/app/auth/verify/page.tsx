import { redirect } from "next/navigation";

import { ReturnButton } from "@/components/return-button";
import { SendVerificationEmailForm } from "@/components/send-verification-email-form";

interface VerifyPageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
  const error = (await searchParams).error;

  if (!error) redirect("/profile");

  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Verify Email</h1>
      </div>

      <p className="text-destructive">
        {error === "invalid_token" || error === "token_expired"
          ? "Your token is invalid or expired, please request a new one."
          : error === "email_not_verified"
            ? "Please verify your email, or request a new verifcation one below"
            : "Oops! Something went wrong. Please try again."}
      </p>

      <SendVerificationEmailForm />
    </div>
  );
}
