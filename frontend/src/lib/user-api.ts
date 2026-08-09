import { apiFetch } from "./api";
import { getToken } from "./auth";
import type { AuthUser } from "./auth";

function authToken() {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  profession: string;
  country: string;
  city: string;
  phone: string;
  linkedinUrl: string;
  websiteUrl: string;
  bio: string;
};

export async function getMe() {
  const res = await apiFetch<{ data: AuthUser }>("/users/me", {
    token: authToken(),
  });
  return res.data;
}

export async function updateMe(input: UpdateProfileInput) {
  const res = await apiFetch<{ data: AuthUser }>("/users/me", {
    method: "PATCH",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return res.data;
}
