import { apiFetch } from "./api";
import { getToken } from "./auth";
import type { CvContent, CvDetail, CvFormatSummary, CvListItem } from "./cv-types";

function authToken() {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export async function listFormats() {
  const res = await apiFetch<{ data: CvFormatSummary[] }>("/formats", {
    token: authToken(),
  });
  return res.data;
}

export async function listCvs() {
  const res = await apiFetch<{ data: CvListItem[] }>("/cvs", {
    token: authToken(),
  });
  return res.data;
}

export async function getCv(id: string) {
  const res = await apiFetch<{ data: CvDetail }>(`/cvs/${id}`, {
    token: authToken(),
  });
  return res.data;
}

export async function createCv(input: {
  title: string;
  templateId: string;
  content?: CvContent;
}) {
  const res = await apiFetch<{ data: CvDetail }>("/cvs", {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function updateCv(
  id: string,
  input: {
    title?: string;
    content?: CvContent;
    isPublished?: boolean;
  }
) {
  const res = await apiFetch<{ data: CvDetail }>(`/cvs/${id}`, {
    method: "PATCH",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function deleteCv(id: string) {
  await apiFetch<unknown>(`/cvs/${id}`, {
    method: "DELETE",
    token: authToken(),
  });
}

export async function duplicateCv(id: string) {
  const res = await apiFetch<{ data: CvDetail }>(`/cvs/${id}/duplicate`, {
    method: "POST",
    token: authToken(),
  });
  return res.data;
}
