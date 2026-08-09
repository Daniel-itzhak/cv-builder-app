import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f4f7fb,#dce5f0)] px-4 py-12">
      <AuthForm mode="login" />
    </div>
  );
}
