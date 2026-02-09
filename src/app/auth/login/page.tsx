import LoginForm from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="container px-8 py-16 mx-auto max-w-5xl space-y-8">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Login</h1>

        <LoginForm />
      </div>
    </div>
  );
}
