"use client";

import { useState } from "react";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { Passkey } from "@better-auth/passkey";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Trash2 } from "lucide-react";

const passkeySchema = z.object({
  name: z.string().min(1),
});

type PasskeyForm = z.infer<typeof passkeySchema>;

export default function PasskeyManagement({
  passkeys,
}: {
  passkeys: Passkey[];
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm<PasskeyForm>({
    resolver: zodResolver(passkeySchema),
    defaultValues: { name: "" },
  });

  const { isSubmitting } = form.formState;

  async function handleAddPasskey(data: PasskeyForm) {
    await authClient.passkey.addPasskey(data, {
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to add passkey");
      },
      onSuccess: () => {
        router.refresh();
        setIsDialogOpen(false);
      },
    });
  }

  function handleDeletePasskey(passkeyId: string) {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  }

  return (
    <div className="">
      <div className="space-y-6">
        {passkeys.length == 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No passkeys yet</CardTitle>
              <CardDescription>
                Add your first passkey to secure, passwordless authentication.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {passkeys.map((passkey) => (
              <Card key={passkey.id}>
                <CardHeader className="flex gap-2 items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>{passkey.name}</CardTitle>
                    <CardDescription>
                      Created {new Date(passkey.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>

                  <Button
                    variant={"destructive"}
                    size={"icon"}
                    onClick={() => handleDeletePasskey(passkey.id)}
                  >
                    <Trash2 />
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(o) => {
            if (o) form.reset();
            setIsDialogOpen(o);
          }}
        >
          <DialogTrigger asChild>
            <Button>New Passkey</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Passkey</DialogTitle>
              <DialogDescription>
                Create a new passkey for secure, passwordless authentication.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleAddPasskey)}
              className="space-y-4"
            >
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Name
                      </FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                <LoadingSwap isLoading={isSubmitting}>Add</LoadingSwap>
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
