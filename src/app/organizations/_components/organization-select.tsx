"use client";

import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const OrganizationSelect = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  if (organizations == null || organizations.length === 0) {
    return null;
  }

  function setActiveOrganization(organizationId: string) {
    authClient.organization.setActive(
      { organizationId },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to switch organization");
        },
      },
    );
  }

  return (
    <Select
      value={activeOrganization?.id ?? ""}
      onValueChange={setActiveOrganization}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select an organization" />
      </SelectTrigger>

      <SelectContent>
        {organizations.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
