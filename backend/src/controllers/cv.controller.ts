import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import * as cvService from "../services/cv.service";

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const contentSchema = z
  .object({
    header: z
      .object({
        fullName: z.string(),
        title: z.string(),
      })
      .optional(),
    contact: z
      .object({
        phone: z.string().optional(),
        email: z.string().optional(),
        linkedin: linkSchema.optional(),
        website: linkSchema.optional(),
      })
      .optional(),
    summary: z.string().optional(),
    skills: z
      .array(
        z.object({
          category: z.string(),
          items: z.string(),
        })
      )
      .optional(),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          dates: z.string(),
          description: z.string().optional(),
        })
      )
      .optional(),
    military: z
      .array(
        z.object({
          role: z.string(),
          dates: z.string(),
          description: z.string().optional(),
        })
      )
      .optional(),
    otherExperience: z
      .array(
        z.object({
          role: z.string(),
          dates: z.string(),
          description: z.string().optional(),
        })
      )
      .optional(),
    languages: z
      .array(
        z.object({
          language: z.string(),
          level: z.string(),
        })
      )
      .optional(),
    experience: z
      .array(
        z.object({
          title: z.string(),
          company: z.string(),
          dates: z.string(),
          companyDescription: z.string().optional(),
          bullets: z.array(
            z
              .union([
                z.string(),
                z.object({
                  title: z.string(),
                  text: z.string(),
                }),
              ])
              .transform((bullet) => {
                if (typeof bullet !== "string") return bullet;
                const raw = bullet.trim();
                if (!raw) return { title: "", text: "" };
                const colonIndex = raw.indexOf(":");
                if (colonIndex === -1) return { title: "", text: raw };
                return {
                  title: raw.slice(0, colonIndex).trim(),
                  text: raw.slice(colonIndex + 1).trim(),
                };
              })
          ),
        })
      )
      .optional(),
    theme: z
      .object({
        colors: z.record(z.string()).optional(),
      })
      .optional(),
    icons: z.record(z.string()).optional(),
  })
  .passthrough();

const createCvSchema = z.object({
  title: z.string().min(1).max(200),
  summary: z.string().max(5000).optional(),
  templateId: z.string().min(1),
  content: contentSchema.optional(),
  isPublished: z.boolean().optional(),
});

const updateCvSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  summary: z.string().max(5000).nullable().optional(),
  content: contentSchema.optional(),
  isPublished: z.boolean().optional(),
});

function requireParam(value: string | string[] | undefined, name: string): string {
  if (typeof value !== "string" || !value) {
    throw new AppError(400, `Missing ${name}`);
  }
  return value;
}

export async function listCvs(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const cvs = await cvService.listCvsForUser(req.user.userId);
  res.status(200).json({ data: cvs });
}

export async function getCv(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const cv = await cvService.getCvForUser(req.user.userId, id);
  res.status(200).json({ data: cv });
}

export async function createCv(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const body = createCvSchema.parse(req.body);
  const cv = await cvService.createCvForUser(req.user.userId, body);
  res.status(201).json({ data: cv });
}

export async function updateCv(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const body = updateCvSchema.parse(req.body);
  const cv = await cvService.updateCvForUser(req.user.userId, id, body);
  res.status(200).json({ data: cv });
}

export async function deleteCv(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  await cvService.deleteCvForUser(req.user.userId, id);
  res.status(204).send();
}

export async function duplicateCv(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const id = requireParam(req.params.id, "id");
  const cv = await cvService.duplicateCvForUser(req.user.userId, id);
  res.status(201).json({ data: cv });
}
