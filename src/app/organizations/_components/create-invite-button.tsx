"use client";

import z from "zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const createInviteSchema = z.object({
  email: z.email().min(3).trim(),
  role: z.enum(["member", "admin"]),
});

type CreateInviteForm = z.infer<typeof createInviteSchema>;

export const CreateInviteButton = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateInviteForm>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleCreateInvite(data: CreateInviteForm) {
    await authClient.organization.inviteMember(data, {
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to invite user");
      },
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Invite</DialogTitle>
          <DialogDescription>
            Invite a user to collaboration with your team.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleCreateInvite)}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Invite Email */}
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="user@example.com"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>Invite</LoadingSwap>
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={isSubmitting}
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </Field>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
