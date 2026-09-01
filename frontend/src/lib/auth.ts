const TOKEN_KEY = "cv_builder_token";
const USER_KEY = "cv_builder_user";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profession: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  bio: string | null;
  createdAt: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function decodeJwtExp(token: string): number | null {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const padded = segment
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(segment.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

/** True when a JWT is in storage and its `exp` claim is still in the future. */
export function hasValidSession(): boolean {
  const token = getToken();
  if (!token) return false;
  const exp = decodeJwtExp(token);
  if (exp === null) return false;
  return exp * 1000 > Date.now();
}

/** Clears local auth and sends the user to login, preserving the current path. */
export function expireSession(): void {
  if (typeof window === "undefined") return;
  clearSession();
  const { pathname, search } = window.location;
  if (pathname === "/login" || pathname === "/register") return;
  const next = encodeURIComponent(`${pathname}${search}`);
  window.location.replace(`/login?next=${next}`);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function clearSession(): void {
  clearToken();
  clearUser();
}

export function getUserInitials(user: AuthUser | null): string {
  if (!user) return "?";
  const first = user.firstName?.trim()?.[0] ?? "";
  const last = user.lastName?.trim()?.[0] ?? "";
  const initials = `${first}${last}`.toUpperCase();
  if (initials) return initials;
  return (user.email?.[0] ?? "?").toUpperCase();
}
