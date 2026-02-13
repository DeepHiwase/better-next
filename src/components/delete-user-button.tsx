"use client";

import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DeleteUserAction } from "@/actions/delete-user.action";

interface DeleteUserButtonProps {
  userId: string;
}

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    setIsPending(true);

    const { error } = await DeleteUserAction({ userId });

    if (error) {
      toast.error(error);
    } else {
      toast.success("User deleted successfully!");
    }

    setIsPending(false);
  }

  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm"
      disabled={isPending}
      onClick={handleClick}
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  );
};

export const PlaceholderDeleteUserButton = () => {
  // use for admins - as not to delet them
  return (
    <Button
      size="icon"
      variant="destructive"
      className="size-7 rounded-sm"
      disabled
    >
      <span className="sr-only">Delete User</span>
      <TrashIcon />
    </Button>
  );
};
