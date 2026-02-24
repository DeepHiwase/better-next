import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";
import { ReturnButton } from "@/components/return-button";
import { Button } from "@/components/ui/button";
import { UpdateUserForm } from "@/components/update-user-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SessionManagement from "@/components/session-management";
import { AccountDeletion } from "@/components/account-deletion";
import { Badge } from "@/components/ui/badge";
import TwoFactorAuth from "@/components/two-factor-auth";
import PasskeyManagement from "@/components/passkey-management";
// import { SessionTab } from "@/components/session-tab";

export default async function Profile() {
  const headersList = await headers();
  const passkeys = await auth.api.listPasskeys({
    headers: headersList,
  });

  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/auth/login"); // if somehow pass proxy - this will protect this page - page level security - recommended ✅
  }
  // session.user.role

  const FULL_POST_ACCESS = await auth.api.userHasPermission({
    headers: headersList,
    body: {
      // userId: session.user.id, // instead can use headers to check if loggedin user has permission or not, this userId can be use when to check if user who ask for permission have permission or not
      permissions: {
        posts: ["update", "delete"], // add permissions you want to add to see if userId user have that or not - success if true
      },
    },
  });

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Profile</h1>

        <div className="flex items-center gap-2">
          {session.user.role === "ADMIN" && (
            <Button size="sm" asChild>
              <Link href="/admin/dashboard">Admin Dashboard</Link>
            </Button>
          )}

          <SignOutButton />
        </div>

        <div className="text-2xl font-bold">Permissions</div>

        <div className="space-x-4">
          <Button size="sm">MANAGE OWN POSTS</Button>
          <Button size="sm" disabled={!FULL_POST_ACCESS.success}>
            MANAGE ALL POSTS
          </Button>
        </div>

        <div className="space-x-4">
          <Button
            size="lg"
            variant="outline"
            className="bg-violet-700 text-white hover:bg-violet-500 transition-colors duration-75"
            asChild
          >
            <Link href="/organizations">Organizations</Link>
          </Button>
        </div>

        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt="User Image"
            className="size-24 border border-primary rounded-md object-cover"
          />
        ) : (
          <div className="size-24 border border-primary rounded-md bg-primary text-primary-foreground flex items-center justify-center">
            <span className="uppercase text-lg font-bold">
              {session.user.name.slice(0, 2)}
            </span>
          </div>
        )}

        <pre className="text-sm overflow-clip">
          {JSON.stringify(session, null, 2)}
        </pre>

        <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-blue-600">
          <h2 className="text-2xl font-bold">Update User</h2>

          <UpdateUserForm
            name={session.user.name}
            image={session.user.image ?? ""}
          />
        </div>

        <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-red-600">
          <h2 className="text-2xl font-bold">Change Password</h2>

          <ChangePasswordForm />

          <SecurityTab
            email={session.user.email}
            isTwoFactorEnabled={session?.user.twoFactorEnabled ?? false}
          />

          <Card>
            <CardHeader className="flex items-center justify-between gap-2">
              <CardTitle>Passkeys</CardTitle>
            </CardHeader>
            <CardContent>
              <PasskeyManagement passkeys={passkeys} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-gray-600">
          <h2 className="text-2xl font-bold">Session Management</h2>

          <SessionTab currentSessionToken={session.session.token} />
        </div>

        <div className="space-y-4 p-4 rounded-b-md border border-t-8 border-destructive">
          <h2 className="text-2xl font-bold">Account Deletion</h2>

          <AccountDeletion />
        </div>
      </div>
    </div>
  );
}

export const SessionTab = async ({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) => {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return (
    <Card>
      <CardContent>
        <SessionManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
};

export const SecurityTab = async ({
  email,
  isTwoFactorEnabled,
}: {
  email: string;
  isTwoFactorEnabled: boolean;
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-2">
        <CardTitle>Two-Factor Authentication</CardTitle>
        <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
          {isTwoFactorEnabled ? "Enabled" : "Disabled"}
        </Badge>
      </CardHeader>
      <CardContent>
        <TwoFactorAuth isEnabled={isTwoFactorEnabled} />
      </CardContent>
    </Card>
  );
};
