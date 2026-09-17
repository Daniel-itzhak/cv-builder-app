import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import * as applicationService from "../services/application.service";

const applicationStatusSchema = z.enum([
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "REJECTED",
  "OFFER",
  "GHOSTED",
]);

const stageStatusSchema = z.enum(["PENDING", "PASSED", "FAILED"]);

const optionalText = z
  .string()
  .max(20000)
  .nullable()
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    const trimmed = value?.trim() || null;
    return trimmed;
  });

const createApplicationSchema = z
  .object({
    companyName: z.string().min(1).max(200),
    companyInfo: optionalText,
    jobTitle: z.string().min(1).max(200),
    jobUrl: z
      .union([z.string().url().max(2000), z.literal("")])
      .nullable()
      .optional()
      .transform((value) => (value ? value : null)),
    appliedFrom: z
      .string()
      .max(200)
      .nullable()
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        return value?.trim() || null;
      }),
    status: applicationStatusSchema.optional(),
    cvId: z
      .union([z.string().min(1), z.literal("")])
      .nullable()
      .optional()
      .transform((value) => (value ? value : null)),
    rejectionReason: z.string().max(5000).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && !data.rejectionReason?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejectionReason is required when status is REJECTED",
        path: ["rejectionReason"],
      });
    }
  });

const updateApplicationSchema = z
  .object({
    companyName: z.string().min(1).max(200).optional(),
    companyInfo: optionalText,
    jobTitle: z.string().min(1).max(200).optional(),
    jobUrl: z
      .union([z.string().url().max(2000), z.literal("")])
      .nullable()
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value ? value : null
      ),
    appliedFrom: z
      .string()
      .max(200)
      .nullable()
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        return value?.trim() || null;
      }),
    status: applicationStatusSchema.optional(),
    cvId: z
      .union([z.string().min(1), z.literal("")])
      .nullable()
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value ? value : null
      ),
    rejectionReason: z.string().max(5000).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "REJECTED" && data.rejectionReason === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejectionReason is required when status is REJECTED",
        path: ["rejectionReason"],
      });
    }
    if (
      data.status === "REJECTED" &&
      data.rejectionReason !== undefined &&
      !data.rejectionReason?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "rejectionReason cannot be empty when status is REJECTED",
        path: ["rejectionReason"],
      });
    }
  });

const createStageSchema = z.object({
  stageName: z.string().min(1).max(200),
  stageDate: z.coerce.date(),
  status: stageStatusSchema.optional(),
  comments: z.string().max(10000).nullable().optional(),
});

const updateStageSchema = z
  .object({
    stageName: z.string().min(1).max(200).optional(),
    stageDate: z.coerce.date().optional(),
    status: stageStatusSchema.optional(),
    comments: z.string().max(10000).nullable().optional(),
  })
  .refine(
    (data) =>
      data.stageName !== undefined ||
      data.stageDate !== undefined ||
      data.status !== undefined ||
      data.comments !== undefined,
    { message: "At least one stage field is required" }
  );

function requireParam(value: string | string[] | undefined, name: string): string {
  if (typeof value !== "string" || !value) {
    throw new AppError(400, `Missing ${name}`);
  }
  return value;
}

export async function listApplications(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const applications = await applicationService.listApplicationsForUser(
    req.user.userId
  );
  res.status(200).json({ data: applications });
}

export async function getApplication(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const application = await applicationService.getApplicationForUser(
    req.user.userId,
    id
  );
  res.status(200).json({ data: application });
}

export async function createApplication(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const body = createApplicationSchema.parse(req.body);
  const application = await applicationService.createApplicationForUser(
    req.user.userId,
    body
  );
  res.status(201).json({ data: application });
}

export async function updateApplication(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const body = updateApplicationSchema.parse(req.body);
  const application = await applicationService.updateApplicationForUser(
    req.user.userId,
    id,
    body
  );
  res.status(200).json({ data: application });
}

export async function addStage(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const body = createStageSchema.parse(req.body);
  const stage = await applicationService.addStageForUser(
    req.user.userId,
    id,
    body
  );

  const application = await applicationService.getApplicationForUser(
    req.user.userId,
    id
  );

  res.status(201).json({ data: { stage, application } });
}

export async function updateStage(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const stageId = requireParam(req.params.stageId, "stageId");
  const body = updateStageSchema.parse(req.body);
  const stage = await applicationService.updateStageForUser(
    req.user.userId,
    id,
    stageId,
    body
  );

  const application = await applicationService.getApplicationForUser(
    req.user.userId,
    id
  );

  res.status(200).json({ data: { stage, application } });
}
