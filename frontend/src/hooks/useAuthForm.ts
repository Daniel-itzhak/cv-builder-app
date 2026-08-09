"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { setToken, type AuthUser } from "@/lib/auth";

type AuthMode = "login" | "register";

type AuthResponse = {
  user: AuthUser;
  token: string;
};

export function useAuthForm(mode: AuthMode) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const payload =
      mode === "login"
        ? {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
          }
        : {
            email: String(form.get("email") ?? ""),
            password: String(form.get("password") ?? ""),
            firstName: String(form.get("firstName") ?? ""),
            lastName: String(form.get("lastName") ?? ""),
          };

    try {
      const result = await apiFetch<AuthResponse>(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setToken(result.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return { error, loading, onSubmit };
}
