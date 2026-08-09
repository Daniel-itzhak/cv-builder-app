import type { Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req: Request, res: Response): Promise<void> {
  const body = registerSchema.parse(req.body);
  const result = await authService.registerUser(body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const body = loginSchema.parse(req.body);
  const result = await authService.loginUser(body);
  res.status(200).json(result);
}
