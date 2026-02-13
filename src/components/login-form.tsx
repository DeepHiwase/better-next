"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { signIn } from "@/lib/auth-client";
import { signInEmailAction } from "@/actions/sign-in-email.action";

export const LoginForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evnt: React.SubmitEvent<HTMLFormElement>) {
    evnt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evnt.target as HTMLFormElement);

    const { error } = await signInEmailAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      // onSuccess logic
      toast.success("Login successful. Good to have you back.");
      router.push("/profile");
    }

    // const email = String(formData.get("email"));
    // if (!email) return toast.error("Please enter your email");

    // const password = String(formData.get("password"));
    // if (!password) return toast.error("Please enter your password");

    // await signIn.email(
    //   {
    //     email,
    //     password,
    //   },
    //   {
    //     onRequest: () => {
    //       setIsPending(true);
    //     },
    //     onResponse: () => {
    //       setIsPending(false);
    //     },
    //     onError: (ctx) => {
    //       toast.error(ctx.error.message);
    //     },
    //     onSuccess: () => {
    //       toast.success("Login successful. Good to have you back.");
    //       router.push("/profile");
    //     },
    //   },
    // );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          placeholder="example@gmail.com"
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          name="password"
          placeholder="xxxxxxxx"
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        Login
      </Button>
    </form>
  );
};
