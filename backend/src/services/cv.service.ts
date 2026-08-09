import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { sidebarClassicDefaultContent } from "../data/default-cv-content";
import { AppError } from "../middleware/errorHandler";
import type { CvContent } from "../types/cv";
import { normalizeCvContent } from "../utils/normalize-cv-content";

export type CreateCvInput = {
  title: string;
  summary?: string;
  templateId: string;
  content?: CvContent;
  isPublished?: boolean;
};

export type UpdateCvInput = {
  title?: string;
  summary?: string | null;
  content?: CvContent;
  isPublished?: boolean;
};

function defaultContentForTemplate(templateId: string): CvContent {
  if (templateId === "fmt_sidebar_classic") {
    return structuredClone(sidebarClassicDefaultContent);
  }
  return structuredClone(sidebarClassicDefaultContent);
}

export async function listCvsForUser(userId: string) {
  return prisma.cv.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      summary: true,
      templateId: true,
      isPublished: true,
      createdAt: true,
      updatedAt: true,
      template: {
        select: { id: true, name: true, thumbnailSchema: true },
      },
    },
  });
}

export async function getCvForUser(userId: string, cvId: string) {
  const cv = await prisma.cv.findFirst({
    where: { id: cvId, userId },
    include: {
      template: {
        select: {
          id: true,
          name: true,
          layoutConfig: true,
          thumbnailSchema: true,
        },
      },
    },
  });

  if (!cv) {
    throw new AppError(404, "CV not found");
  }

  return cv;
}

export async function createCvForUser(userId: string, input: CreateCvInput) {
  const format = await prisma.cvFormat.findFirst({
    where: { id: input.templateId, isActive: true },
  });

  if (!format) {
    throw new AppError(400, "Invalid or inactive template");
  }

  const content = normalizeCvContent(
    input.content ?? defaultContentForTemplate(input.templateId)
  );

  return prisma.cv.create({
    data: {
      userId,
      title: input.title.trim(),
      summary: input.summary?.trim(),
      templateId: input.templateId,
      content: content as Prisma.InputJsonValue,
      isPublished: input.isPublished ?? false,
    },
    include: {
      template: {
        select: {
          id: true,
          name: true,
          layoutConfig: true,
          thumbnailSchema: true,
        },
      },
    },
  });
}

export async function updateCvForUser(
  userId: string,
  cvId: string,
  input: UpdateCvInput
) {
  await getCvForUser(userId, cvId);

  return prisma.cv.update({
    where: { id: cvId },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.summary !== undefined
        ? { summary: input.summary?.trim() ?? null }
        : {}),
      ...(input.content !== undefined
        ? {
            content: normalizeCvContent(
              input.content
            ) as Prisma.InputJsonValue,
          }
        : {}),
      ...(input.isPublished !== undefined
        ? { isPublished: input.isPublished }
        : {}),
    },
    include: {
      template: {
        select: {
          id: true,
          name: true,
          layoutConfig: true,
          thumbnailSchema: true,
        },
      },
    },
  });
}

export async function deleteCvForUser(userId: string, cvId: string) {
  await getCvForUser(userId, cvId);
  await prisma.cv.delete({ where: { id: cvId } });
}
