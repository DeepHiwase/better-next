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

const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name must be atleast 1 character long."), // this error message are passed to error fields in react-hook-form
});

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>;

export const CreateOrganizationButton = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "", // to show in ui initially, if use this as final then zod will validatie on this value 👲
    },
  });

  const { isSubmitting } = form.formState;

  async function handleCreateOrganization(data: CreateOrganizationForm) {
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const res = await authClient.organization.create({
      name: data.name,
      slug,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to create organization");
    } else {
      form.reset();
      setOpen(false);
      await authClient.organization.setActive({ organizationId: res.data.id });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
          <DialogDescription>
            Create a new organization to collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleCreateOrganization)}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Organization Name */}
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                // data-invalid - make red all label if invalid i/p
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Acme Inc."
                    aria-invalid={fieldState.invalid} // to show red outline if invalid i/p data
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>Create</LoadingSwap>
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
