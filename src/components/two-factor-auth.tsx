"use client";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import QRCode from "react-qr-code";

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

const twoFactorAuthSchema = z.object({
  password: z.string().min(1),
});

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>;
type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export default function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const router = useRouter();

  const form = useForm<TwoFactorAuthForm>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: { password: "" },
  });

  const { isSubmitting } = form.formState;

  async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to disable 2FA");
        },
        onSuccess: () => {
          form.reset();
          router.refresh();
        },
      },
    );
  }

  async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
    const result = await authClient.twoFactor.enable({
      password: data.password,
    });

    if (result.error) {
      toast.error(result.error.message || "Failed to enable 2FA");
    } else {
      setTwoFactorData(result.data);
      form.reset();
    }
  }

  if (twoFactorData != null) {
    return (
      <QRCodeVerify {...twoFactorData} onDone={() => setTwoFactorData(null)} />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(
        isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
      )}
      className="space-y-4"
    >
      <FieldGroup>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-demo-title">Password</FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="xxxxxxxx"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        variant={isEnabled ? "destructive" : "default"}
      >
        <LoadingSwap isLoading={isSubmitting}>
          {isEnabled ? "Disable 2FA" : "Enable 2FA"}
        </LoadingSwap>
      </Button>
    </form>
  );
}

const qrSchema = z.object({
  token: z.string().length(6),
});

type QRForm = z.infer<typeof qrSchema>;

function QRCodeVerify({
  onDone,
  backupCodes,
  totpURI,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const router = useRouter();

  const form = useForm<QRForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: { token: "" },
  });

  const { isSubmitting } = form.formState;

  async function handleQRCode(data: QRForm) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to verify code");
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true);
          router.refresh();
        },
      },
    );
  }

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div className="font-mono text-sm" key={index}>
              {code}
            </div>
          ))}
        </div>

        <Button variant={"outline"} onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Scan this QR code with your authenticator app and enter the code below:
      </p>

      <form onSubmit={form.handleSubmit(handleQRCode)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="token"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Code</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="xxxxxxxx"
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
          <LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
        </Button>
      </form>

      <div className="p-4 text-white w-fit">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}
