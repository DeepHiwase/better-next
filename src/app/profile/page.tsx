import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <p className="text-destructive">Unauthorized</p>;
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Profile</h1>

        <SignOutButton />

        <pre className="text-sm overflow-clip">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
