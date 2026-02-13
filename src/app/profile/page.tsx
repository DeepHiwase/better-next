import { headers } from "next/headers";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import SignOutButton from "@/components/sign-out-button";
import { ReturnButton } from "@/components/return-button";

export default async function Profile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login"); // if somehow pass proxy - this will protect this page - page level security - recommended ✅
  }

  return (
    <div className="px-8 py-16 container mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Profile</h1>

        <SignOutButton />

        <pre className="text-sm overflow-clip">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
}
