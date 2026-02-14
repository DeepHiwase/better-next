import Link from "next/link";

import { RegisterForm } from "@/components/register-form";
import { ReturnButton } from "@/components/return-button";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";

export default function RegisterPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-8 py-16">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Register</h1>

        <div className="space-y-4">
          <RegisterForm />

          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="hover:text-foreground">
              Login
            </Link>
          </p>
        </div>

        <hr className="max-w-sm" />

        <div className="flex flex-col max-w-sm gap-4">
          <SignInOauthButton signUp provider="google" />
          <SignInOauthButton signUp provider="github" />
        </div>
      </div>
    </div>
  );
}
