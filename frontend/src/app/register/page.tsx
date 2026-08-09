import { Suspense } from "react";
import { GuestOnly } from "@/components/auth/GuestOnly";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <GuestOnly>
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f4f7fb,#dce5f0)] px-4 py-12">
        <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading…</p>}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </GuestOnly>
  );
}
