export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight">
        Settings
      </h2>
      <p className="text-[var(--muted)]">
        Profile and account settings will land here. JWT auth is ready to migrate
        to Auth0/Clerk later.
      </p>
    </div>
  );
}
