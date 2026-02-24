"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function InviteInformation({
  invitation,
}: {
  invitation: { id: string; organizationId: string };
}) {
  const router = useRouter();

  function acceptInvite() {
    return authClient.organization.acceptInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onSuccess: async () => {
          await authClient.organization.setActive({
            organizationId: invitation.organizationId,
          });
          router.push("/organizations");
        },
      },
    );
  }
  function rejectInvite() {
    return authClient.organization.rejectInvitation(
      {
        invitationId: invitation.id,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      },
    );
  }

  return (
    <div className="flex gap-4">
      <Button className="" onClick={() => acceptInvite()}>
        Accept
      </Button>
      <Button
        className=""
        variant={"destructive"}
        onClick={() => rejectInvite()}
      >
        Reject
      </Button>
    </div>
  );
}
