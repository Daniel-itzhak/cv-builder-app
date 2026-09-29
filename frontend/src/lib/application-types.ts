export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEWING"
  | "REJECTED"
  | "OFFER"
  | "GHOSTED";

export type RejectionReason =
  | "AUTO_REJECT"
  | "POST_HR_SCREEN"
  | "POST_TECH_ASSESSMENT"
  | "POST_TECH_INTERVIEW"
  | "CULTURE_FIT_FINAL_ROUND"
  | "POSITION_CANCELLED"
  | "COMPENSATION_MISMATCH"
  | "ROLE_CHANGED"
  | "WITHDREW"
  | "OTHER";

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
  rejectionReason: RejectionReason;
  rejectionNotes: string | null;
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
  "GHOSTED",
];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  REJECTED: "Rejected",
  OFFER: "Offer",
  GHOSTED: "Ghosted",
};

export const REJECTION_REASONS: RejectionReason[] = [
  "AUTO_REJECT",
  "POST_HR_SCREEN",
  "POST_TECH_ASSESSMENT",
  "POST_TECH_INTERVIEW",
  "CULTURE_FIT_FINAL_ROUND",
  "POSITION_CANCELLED",
  "COMPENSATION_MISMATCH",
  "ROLE_CHANGED",
  "WITHDREW",
  "OTHER",
];

export const REJECTION_REASON_LABELS: Record<RejectionReason, string> = {
  AUTO_REJECT: "Auto-Reject",
  POST_HR_SCREEN: "Post HR Screen",
  POST_TECH_ASSESSMENT: "Post Tech Assessment",
  POST_TECH_INTERVIEW: "Post Tech Interview",
  CULTURE_FIT_FINAL_ROUND: "Culture Fit",
  POSITION_CANCELLED: "Position Cancelled",
  COMPENSATION_MISMATCH: "Budget Cut",
  ROLE_CHANGED: "Role Changed",
  WITHDREW: "Withdrew",
  OTHER: "Other",
};

export function isUncategorizedRejection(
  application: Pick<JobApplication, "status" | "rejectionReason">
): boolean {
  return (
    application.status === "REJECTED" && application.rejectionReason === "OTHER"
  );
}

export const STAGE_STATUSES: StageStatus[] = ["PENDING", "PASSED", "FAILED"];

export const STAGE_STATUS_LABELS: Record<StageStatus, string> = {
  PENDING: "Pending",
  PASSED: "Passed",
  FAILED: "Failed",
};
