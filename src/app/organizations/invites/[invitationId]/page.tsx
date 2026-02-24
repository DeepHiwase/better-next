import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InviteInformation from "@/app/organizations/invites/[invitationId]/_components/invite-information";

export default async function InvitationPage({
  params,
}: PageProps<"/organizations/invites/[invitationId]">) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect("/auth/login");

  const { invitationId } = await params;

  const invitation = await auth.api
    .getInvitation({
      headers: await headers(),
      query: { id: invitationId },
    })
    .catch(() => redirect("/"));

  return (
    <div className="container mx-auto my-6 max-w-2xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Organization Invitation</CardTitle>
          <CardDescription>
            You have been invited to join the {invitation.organizationName}{" "}
            organization as a {invitation.role}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <InviteInformation invitation={invitation} />
        </CardContent>
      </Card>
    </div>
  );
}
