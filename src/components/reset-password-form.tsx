"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth-client";

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evnt: React.SubmitEvent<HTMLFormElement>) {
    evnt.preventDefault();

    const formDate = new FormData(evnt.target as HTMLFormElement);

    const password = String(formDate.get("password"));
    if (!password) return toast.error("Please enter your password.");

    const confirmPassword = String(formDate.get("confirmPassword"));
    if (confirmPassword !== password)
      return toast.error("Password do not match.");

    await resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Password reset successfully.");
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New Password</Label>
        <Input type="password" id="password" name="password" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input type="password" id="confirmPassword" name="confirmPassword" />
      </div>

      <Button type="submit" disabled={isPending}>
        Reset Password
      </Button>
    </form>
  );
};
