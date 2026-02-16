"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateUser } from "@/lib/auth-client";

interface UpdateUserFormProps {
  name: string;
  image: string;
}

export const UpdateUserForm = ({ name, image }: UpdateUserFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evnt: React.SubmitEvent<HTMLFormElement>) {
    evnt.preventDefault();

    const formData = new FormData(evnt.target as HTMLFormElement);
    const name = String(formData.get("name"));
    const image = String(formData.get("image"));

    if (!name && !image) {
      return toast.error("Please enter a name or image");
    }

    await updateUser({
      ...(name && { name }), // only if we have name - update name
      image,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("User updated successfully!");
          // reset form 💎
          (evnt.target as HTMLFormElement).reset();
          // show like refresh
          router.refresh();
        },
      },
    });
  }

  return (
    <form className="max-w-sm w-full space-y-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={name} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Image</Label>
        <Input type="url" id="image" name="image" defaultValue={image} />
      </div>

      <Button type="submit" disabled={isPending}>
        Update User
      </Button>
    </form>
  );
};
