import type { ApplicationStatus, StageStatus } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export type CreateApplicationInput = {
  companyName: string;
  companyInfo?: string | null;
  jobTitle: string;
  jobUrl?: string | null;
  appliedFrom?: string | null;
  status?: ApplicationStatus;
  cvId?: string | null;
  rejectionReason?: string | null;
};

export type UpdateApplicationInput = {
  companyName?: string;
  companyInfo?: string | null;
  jobTitle?: string;
  jobUrl?: string | null;
  appliedFrom?: string | null;
  status?: ApplicationStatus;
  cvId?: string | null;
  rejectionReason?: string | null;
};

export type CreateStageInput = {
  stageName: string;
  stageDate: Date;
  status?: StageStatus;
  comments?: string | null;
};

export const GHOSTED_STAGE_NAME = "Ghosted";
export const GHOSTED_STAGE_COMMENT =
  "User marked as ghosted due to inactivity.";

const applicationInclude = {
  stages: {
    orderBy: { stageDate: "asc" as const },
  },
  cv: {
    select: { id: true, title: true },
  },
};

async function assertCvOwnership(userId: string, cvId: string) {
  const cv = await prisma.cv.findFirst({
    where: { id: cvId, userId },
    select: { id: true },
  });

  if (!cv) {
    throw new AppError(400, "Invalid CV for this user");
  }
}

export async function listApplicationsForUser(userId: string) {
  return prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: applicationInclude,
  });
}

export async function getApplicationForUser(
  userId: string,
  applicationId: string
) {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId, userId },
    include: applicationInclude,
  });

  if (!application) {
    throw new AppError(404, "Application not found");
  }

  return application;
}

export async function createApplicationForUser(
  userId: string,
  input: CreateApplicationInput
) {
  if (input.cvId) {
    await assertCvOwnership(userId, input.cvId);
  }

  if (input.status === "REJECTED" && !input.rejectionReason?.trim()) {
    throw new AppError(400, "rejectionReason is required when status is REJECTED");
  }

  return prisma.jobApplication.create({
    data: {
      userId,
      companyName: input.companyName.trim(),
      companyInfo: input.companyInfo?.trim() || null,
      jobTitle: input.jobTitle.trim(),
      jobUrl: input.jobUrl?.trim() || null,
      appliedFrom: input.appliedFrom?.trim() || null,
      status: input.status ?? "SAVED",
      cvId: input.cvId ?? null,
      rejectionReason:
        input.status === "REJECTED"
          ? input.rejectionReason?.trim() || null
          : null,
    },
    include: applicationInclude,
  });
}

export async function updateApplicationForUser(
  userId: string,
  applicationId: string,
  input: UpdateApplicationInput
) {
  const existing = await getApplicationForUser(userId, applicationId);

  if (input.cvId) {
    await assertCvOwnership(userId, input.cvId);
  }

  const nextStatus = input.status ?? existing.status;
  const nextRejectionReason =
    input.rejectionReason !== undefined
      ? input.rejectionReason?.trim() || null
      : existing.rejectionReason;

  if (nextStatus === "REJECTED" && !nextRejectionReason) {
    throw new AppError(400, "rejectionReason is required when status is REJECTED");
  }

  // Only touch rejectionReason when status/reason are part of this update.
  const rejectionReasonUpdate =
    input.status !== undefined || input.rejectionReason !== undefined
      ? nextStatus !== "REJECTED"
        ? { rejectionReason: null }
        : { rejectionReason: nextRejectionReason }
      : {};

  const becomingGhosted =
    input.status === "GHOSTED" && existing.status !== "GHOSTED";

  return prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      ...(input.companyName !== undefined
        ? { companyName: input.companyName.trim() }
        : {}),
      ...(input.companyInfo !== undefined
        ? { companyInfo: input.companyInfo?.trim() || null }
        : {}),
      ...(input.jobTitle !== undefined
        ? { jobTitle: input.jobTitle.trim() }
        : {}),
      ...(input.jobUrl !== undefined
        ? { jobUrl: input.jobUrl?.trim() || null }
        : {}),
      ...(input.appliedFrom !== undefined
        ? { appliedFrom: input.appliedFrom?.trim() || null }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.cvId !== undefined ? { cvId: input.cvId } : {}),
      ...rejectionReasonUpdate,
      ...(becomingGhosted
        ? {
            stages: {
              create: {
                stageName: GHOSTED_STAGE_NAME,
                stageDate: new Date(),
                status: "PENDING" as const,
                comments: GHOSTED_STAGE_COMMENT,
              },
            },
          }
        : {}),
    },
    include: applicationInclude,
  });
}

export type UpdateStageInput = {
  stageName?: string;
  stageDate?: Date;
  status?: StageStatus;
  comments?: string | null;
};

export async function addStageForUser(
  userId: string,
  applicationId: string,
  input: CreateStageInput
) {
  await getApplicationForUser(userId, applicationId);

  return prisma.applicationStage.create({
    data: {
      applicationId,
      stageName: input.stageName.trim(),
      stageDate: input.stageDate,
      status: input.status ?? "PENDING",
      comments: input.comments?.trim() || null,
    },
  });
}

export async function updateStageForUser(
  userId: string,
  applicationId: string,
  stageId: string,
  input: UpdateStageInput
) {
  await getApplicationForUser(userId, applicationId);

  const stage = await prisma.applicationStage.findFirst({
    where: { id: stageId, applicationId },
    select: { id: true },
  });

  if (!stage) {
    throw new AppError(404, "Stage not found");
  }

  return prisma.applicationStage.update({
    where: { id: stageId },
    data: {
      ...(input.stageName !== undefined
        ? { stageName: input.stageName.trim() }
        : {}),
      ...(input.stageDate !== undefined ? { stageDate: input.stageDate } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.comments !== undefined
        ? { comments: input.comments?.trim() || null }
        : {}),
    },
  });
}
