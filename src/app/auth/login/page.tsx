import Link from "next/link";

import { LoginForm } from "@/components/login-form";
import { ReturnButton } from "@/components/return-button";

export default function LoginPage() {
  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Login</h1>

        <LoginForm />

        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="hover:text-foreground">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
