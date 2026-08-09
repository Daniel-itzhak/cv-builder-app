export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "REJECTED"
  | "OFFER";

export type StageStatus = "PENDING" | "PASSED" | "FAILED";

export type ApplicationStage = {
  id: string;
  applicationId: string;
  stageName: string;
  stageDate: string;
  status: StageStatus;
  comments: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JobApplication = {
  id: string;
  userId: string;
  cvId: string | null;
  companyName: string;
  companyInfo: string | null;
  jobTitle: string;
  jobUrl: string | null;
  appliedFrom: string | null;
  status: ApplicationStatus;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  stages: ApplicationStage[];
  cv?: { id: string; title: string } | null;
};

export const APPLIED_FROM_OPTIONS = [
  "LinkedIn",
  "Company website",
  "Indeed",
  "Glassdoor",
  "Referral",
  "Recruiter",
  "Job fair",
  "Other",
] as const;

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "REJECTED",
  "OFFER",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  REJECTED: "Rejected",
  OFFER: "Offer",
};

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  PENDING: "Pending",
  PASSED: "Passed",
  FAILED: "Failed",
};
