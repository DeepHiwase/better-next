import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { ReturnButton } from "@/components/return-button";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

export default function LoginPage() {
  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Login</h1>

        <div className="space-y-4">
          <LoginForm />

          <p className="text-muted-foreground text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="hover:text-foreground">
              Register
            </Link>
          </p>
        </div>

        <hr className="max-w-sm" />

        <div className="flex flex-col max-w-sm gap-4">
          <SignInOauthButton provider="google" />
          <SignInOauthButton provider="github" />
        </div>
      </div>
    </div>
  );
}
