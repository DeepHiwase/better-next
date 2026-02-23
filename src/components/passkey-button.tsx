"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { DeleteIcon } from "lucide-react";
import { useEffect } from "react";

export const PasskeyButton = () => {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess: () => {
          refetch(); // refetch session as not problems with next sessions ⚠️
          router.push("/profile");
        },
      },
    );
  }, [router, refetch]);

  async function handleClick() {
    await authClient.signIn.passkey(undefined, {
      onSuccess: () => {
        refetch(); // refetch session as not problems with next sessions ⚠️
        router.push("/profile");
      },
    });
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleClick}>
      Use Passkey
      <DeleteIcon />
    </Button>
  );
};
