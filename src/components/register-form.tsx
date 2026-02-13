"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { signUp } from "@/lib/auth-client";
import { signUpEmailAction } from "@/actions/sign-up-email.action";

export const RegisterForm = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(evnt: React.SubmitEvent<HTMLFormElement>) {
    evnt.preventDefault();

    setIsPending(true);

    const formData = new FormData(evnt.target as HTMLFormElement);

    const { error } = await signUpEmailAction(formData);

    if (error) {
      toast.error(error);
      setIsPending(false);
    } else {
      // onSuccess logic
      toast.success("Registration complete. You're all set.");
      router.push("/auth/login"); // since disable autoSignIn
    }

    // const name = String(formData.get("name"));
    // if (!name) return toast.error("Please enter your name");

    // const email = String(formData.get("email"));
    // if (!email) return toast.error("Please enter your email");

    // const password = String(formData.get("password"));
    // if (!password) return toast.error("Please enter your password");

    // await signUp.email(
    //   {
    //     name,
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
    //       toast.success("Registration complete. You're all set.");
    //       router.push("/profile");
    //     },
    //   },
    // );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="john doe"
          autoComplete="name"
        />
      </div>

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
          autoComplete="new-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        Register
      </Button>
    </form>
  );
};
