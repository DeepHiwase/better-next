import { redirect } from "next/navigation";

import { ReturnButton } from "@/components/return-button";
import { ResetPasswordForm } from "@/components/reset-password-form";

interface ResetPasswordPageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = (await searchParams).token;

  if (!token) redirect("/auth/login");

  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Reset Password</h1>
      </div>

      <p className="text-muted-foreground">
        Please enter your new password. Make sure it is at least 6 characters.
      </p>

      <ResetPasswordForm token={token} />
    </div>
  );
}
