"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthForm } from "@/hooks/useAuthForm";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { error, loading, onSubmit } = useAuthForm(mode);
  const isLogin = mode === "login";

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-[var(--line)] bg-[var(--paper)] p-8 shadow-sm">
      <div className="mb-8 flex flex-col items-center text-center">
        <Link href="/" className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--ink)] text-[var(--paper)]">
            <FileText className="h-4 w-4" aria-hidden />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight">
            Folio
          </span>
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ink)]">
          {isLogin ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {isLogin
            ? "Sign in to manage your CVs."
            : "Start building polished CVs in minutes."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {!isLogin && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First name"
              name="firstName"
              autoComplete="given-name"
              required
            />
            <Input
              label="Last name"
              name="lastName"
              autoComplete="family-name"
              required
            />
          </div>
        )}
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          minLength={isLogin ? undefined : 8}
          required
        />

        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Please wait…" : isLogin ? "Log in" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        {isLogin ? "No account yet?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-medium text-[var(--accent)] underline-offset-4 hover:underline"
        >
          {isLogin ? "Register" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
