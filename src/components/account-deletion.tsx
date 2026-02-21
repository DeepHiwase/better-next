"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { DeleteIcon } from "lucide-react";

export const AccountDeletion = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick() {
    await authClient.deleteUser({
      callbackURL: "/",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          return;
        },
        onSuccess: () => {
          toast.success(
            "Account deletion initiated. Please check your email to confirm.",
          );
          router.push("/auth/login");
        },
      },
    });
  }

  return (
    <Button
      variant="destructive"
      className="w-full"
      disabled={isPending}
      onClick={handleClick}
    >
      Delete Account Permanently 💀
      <DeleteIcon />
    </Button>
  );
};
