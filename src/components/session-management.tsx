"use client";

import { Session } from "better-auth";
import { UAParser } from "ua-parser-js";
// import { revokeOtherSessions, revokeSession } from "better-auth/api"; // for server side
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

import { AlertTriangle, Monitor, Smartphone, Trash } from "lucide-react";

export default function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const router = useRouter();
  const otherSessions = sessions.filter((s) => s.token != currentSessionToken);
  const currentSession = sessions.find((s) => s.token == currentSessionToken);

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Active Sessions</h3>
          {otherSessions.length > 0 && (
            <Button
              variant={"destructive"}
              size={"sm"}
              onClick={revokeOtherSessions}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Revoke All Other Sessions
            </Button>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No other active sesions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                // isCurrentSession={false} // as defaults to false as we defined
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const SessionCard = ({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) => {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function revokeSession() {
    return authClient.revokeSession(
      { token: session.token },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {isCurrentSession && <Badge>Current Session</Badge>}
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone />
            ) : (
              <Monitor />
            )}
            <div>
              <p className="text-sm text-muted-foreground">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>

          {!isCurrentSession && (
            <Button variant={"destructive"} size={"sm"} onClick={revokeSession}>
              <Trash />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
