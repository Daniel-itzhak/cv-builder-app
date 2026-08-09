import { RequireAuth } from "@/components/auth/RequireAuth";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  );
}
