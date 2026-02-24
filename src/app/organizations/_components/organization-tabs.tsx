"use client";

import { authClient } from "@/lib/auth-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MembersTab } from "@/app/organizations/_components/members-tab";
import { InvitesTab } from "@/app/organizations/_components/invites-tab";

export const OrganizationTabs = () => {
  const { data: activeOrganization } = authClient.useActiveOrganization();

  return (
    <div className="space-y-4">
      {activeOrganization && (
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          </TabsList>

          <Card>
            <CardContent>
              <TabsContent value="members">
                <MembersTab />
              </TabsContent>

              <TabsContent value="invitations">
                <InvitesTab />
              </TabsContent>

              <TabsContent value="subscriptions">
                {/* <SubscriptionsTab /> */}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  );
};
