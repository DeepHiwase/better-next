"use client";

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

const totpSchema = z.object({
  code: z.string().length(6),
});

type TotpForm = z.infer<typeof totpSchema>;

export default function TotpForm() {
  const router = useRouter();

  const form = useForm<TotpForm>({
    resolver: zodResolver(totpSchema),
    defaultValues: { code: "" },
  });

  const { isSubmitting } = form.formState;

  async function handleTotpVerification(data: TotpForm) {
    await authClient.twoFactor.verifyTotp(data, {
      onError: (ctx) => {
        toast.error(ctx.error.message || "Failed to verify code");
      },
      onSuccess: () => {
        router.push("/profile");
      },
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleTotpVerification)}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="code"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Code</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        <LoadingSwap isLoading={isSubmitting}>Verify</LoadingSwap>
      </Button>
    </form>
  );
}
