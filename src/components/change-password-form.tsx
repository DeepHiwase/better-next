"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChangePasswordAction } from "@/actions/change-password.action";

export const ChangePasswordForm = () => {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(evnt: React.SubmitEvent<HTMLFormElement>) {
    evnt.preventDefault();

    const formData = new FormData(evnt.target as HTMLFormElement);

    setIsPending(true);

    const { error } = await ChangePasswordAction(formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Password changed successfully.");
      (evnt.target as HTMLFormElement).reset();
    }

    setIsPending(false);
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input type="password" id="currentPassword" name="currentPassword" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input type="password" id="newPassword" name="newPassword" />
      </div>

      <Button type="submit" disabled={isPending}>
        Change Password
      </Button>
    </form>
  );
};
