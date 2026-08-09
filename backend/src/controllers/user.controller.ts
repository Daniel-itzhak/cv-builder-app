import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../middleware/errorHandler";
import * as userService from "../services/user.service";

const nullableString = (max: number) =>
  z.string().max(max).nullable().optional();

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  profession: nullableString(200),
  country: nullableString(120),
  city: nullableString(120),
  phone: nullableString(40),
  linkedinUrl: nullableString(500),
  websiteUrl: nullableString(500),
  bio: nullableString(2000),
});

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const user = await userService.getUserById(req.user.userId);
  res.status(200).json({ data: user });
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new AppError(401, "Unauthorized");
  }

  const body = updateProfileSchema.parse(req.body);
  const user = await userService.updateUserProfile(req.user.userId, body);
  res.status(200).json({ data: user });
}
