import { ReturnButton } from "@/components/return-button";

interface LoginErrorPageProps {
  searchParams: Promise<{ error: string }>;
}

export default async function LoginErrorPage({
  searchParams,
}: LoginErrorPageProps) {
  const { error } = await searchParams;

  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/auth/login" label="Login" />

        <h1 className="text-3xl font-bold">Login Error</h1>
      </div>

      <p className="text-destructive">
        {error === "account_not_linked"
          ? "This account is already linked to another sign-in method."
          : "Oops! Something went wrong. Please try again."}
      </p>
    </div>
  );
}
