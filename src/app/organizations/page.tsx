import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ReturnButton } from "@/components/return-button";
import { OrganizationSelect } from "@/app/organizations/_components/organization-select";
import { CreateOrganizationButton } from "@/app/organizations/_components/create-organization-button";
import { OrganizationTabs } from "@/app/organizations/_components/organization-tabs";

export default async function OrganizationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect("/auth/login");

  return (
    <div className="container mx-auto my-6 px-4">
      <ReturnButton href="/" label="Home" />

      <div className="mb-8 flex items-center gap-2">
        <OrganizationSelect />
        <CreateOrganizationButton />
      </div>

      <OrganizationTabs />
    </div>
  );
}
