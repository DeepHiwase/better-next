import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";
import { ReturnButton } from "@/components/return-button";
import { Button } from "@/components/ui/button";

export default async function Profile() {
  const headersList = await headers();

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

        <pre className="text-sm overflow-clip">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
