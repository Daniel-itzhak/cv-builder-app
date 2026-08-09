import { apiFetch } from "./api";
import { getToken } from "./auth";
import type {
  ApplicationStatus,
  JobApplication,
  StageStatus,
} from "./application-types";

function authToken() {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  return token;
}

export async function listApplications() {
  const res = await apiFetch<{ data: JobApplication[] }>("/applications", {
    token: authToken(),
  });
  return res.data;
}

export async function getApplication(id: string) {
  const res = await apiFetch<{ data: JobApplication }>(`/applications/${id}`, {
    token: authToken(),
  });
  return res.data;
}

export async function createApplication(input: {
  companyName: string;
  companyInfo?: string | null;
  jobTitle: string;
  jobUrl?: string | null;
  appliedFrom?: string | null;
  status?: ApplicationStatus;
  cvId?: string | null;
  rejectionReason?: string | null;
}) {
  const res = await apiFetch<{ data: JobApplication }>("/applications", {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function updateApplication(
  id: string,
  input: {
    companyName?: string;
    companyInfo?: string | null;
    jobTitle?: string;
    jobUrl?: string | null;
    appliedFrom?: string | null;
    status?: ApplicationStatus;
    cvId?: string | null;
    rejectionReason?: string | null;
  }
) {
  const res = await apiFetch<{ data: JobApplication }>(`/applications/${id}`, {
    method: "PUT",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return res.data;
}

export async function addApplicationStage(
  applicationId: string,
  input: {
    stageName: string;
    stageDate: string;
    status?: StageStatus;
    comments?: string | null;
  }
) {
  const res = await apiFetch<{
    data: { stage: unknown; application: JobApplication };
  }>(`/applications/${applicationId}/stages`, {
    method: "POST",
    token: authToken(),
    body: JSON.stringify(input),
  });
  return res.data.application;
}
