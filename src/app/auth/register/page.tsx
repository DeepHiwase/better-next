import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 px-8 py-16">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Register</h1>

        <RegisterForm />
      </div>
    </div>
  );
}
