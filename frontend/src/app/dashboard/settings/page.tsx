"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUser, setUser, type AuthUser } from "@/lib/auth";
import { getMe, updateMe } from "@/lib/user-api";

type ProfileForm = {
  firstName: string;
  lastName: string;
  profession: string;
  country: string;
  city: string;
  phone: string;
  linkedinUrl: string;
  websiteUrl: string;
  bio: string;
  email: string;
};

function formFromUser(user: AuthUser): ProfileForm {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    profession: user.profession ?? "",
    country: user.country ?? "",
    city: user.city ?? "",
    phone: user.phone ?? "",
    linkedinUrl: user.linkedinUrl ?? "",
    websiteUrl: user.websiteUrl ?? "",
    bio: user.bio ?? "",
    email: user.email ?? "",
  };
}

export default function SettingsPage() {
  const [form, setForm] = useState<ProfileForm>(() => {
    const cached = getUser();
    return cached
      ? formFromUser(cached)
      : {
          firstName: "",
          lastName: "",
          profession: "",
          country: "",
          city: "",
          phone: "",
          linkedinUrl: "",
          websiteUrl: "",
          bio: "",
          email: "",
        };
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const cached = getUser();
    if (cached) {
      setForm(formFromUser(cached));
    }

    void (async () => {
      try {
        const user = await getMe();
        setUser(user);
        setForm(formFromUser(user));
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load profile";
        // Keep cached login email/name visible even if the API is temporarily down.
        if (cached?.email) {
          setError(
            `Could not refresh profile from server (${message}). Showing saved account details.`
          );
        } else {
          setError(
            `${message}. Make sure the API is running on port 4000, then refresh. If you just logged in before this update, log out and log back in.`
          );
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updateField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const user = await updateMe({
        firstName: form.firstName,
        lastName: form.lastName,
        profession: form.profession,
        country: form.country,
        city: form.city,
        phone: form.phone,
        linkedinUrl: form.linkedinUrl,
        websiteUrl: form.websiteUrl,
        bio: form.bio,
      });
      setUser(user);
      setSaved(true);
      window.dispatchEvent(new Event("folio:user-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-[var(--muted)]">Loading profile…</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Settings
        </h2>
        <p className="mt-1 text-[var(--muted)]">
          Update your personal details. These can later prefill new CVs.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-5 md:p-6"
      >
        <section className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
            Account
          </h3>
          <Input label="Email" value={form.email} disabled />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="First name"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
            <Input
              label="Last name"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
            />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
            Professional
          </h3>
          <Input
            label="Profession / title"
            placeholder="e.g. Full Stack Developer"
            value={form.profession}
            onChange={(e) => updateField("profession", e.target.value)}
          />
          <Textarea
            label="Short bio"
            placeholder="A short professional summary about you"
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </section>

        <section className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg tracking-tight">
            Location & contact
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Country"
              placeholder="e.g. Israel"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
            />
            <Input
              label="City"
              placeholder="e.g. Tel Aviv"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
            />
          </div>
          <Input
            label="Phone"
            placeholder="+972..."
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedinUrl}
            onChange={(e) => updateField("linkedinUrl", e.target.value)}
          />
          <Input
            label="Website URL"
            placeholder="https://..."
            value={form.websiteUrl}
            onChange={(e) => updateField("websiteUrl", e.target.value)}
          />
        </section>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        {saved ? (
          <p className="rounded-md bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--accent)]">
            Profile saved.
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
