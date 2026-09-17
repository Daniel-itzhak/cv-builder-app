import type { JobApplication } from "./application-types";

export const STALE_INACTIVITY_DAYS = 30;

export function daysSinceUpdate(
  updatedAt: string,
  now: Date = new Date()
): number {
  const updated = new Date(updatedAt);
  const diffMs = now.getTime() - updated.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return 0;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isStaleApplication(
  application: Pick<JobApplication, "status" | "updatedAt">,
  now: Date = new Date()
): boolean {
  if (application.status !== "APPLIED" && application.status !== "INTERVIEWING") {
    return false;
  }
  return daysSinceUpdate(application.updatedAt, now) > STALE_INACTIVITY_DAYS;
}
