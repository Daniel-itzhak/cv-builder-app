const TOKEN_KEY = "cv_builder_token";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
