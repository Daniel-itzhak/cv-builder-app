import type { NextFunction, Request, Response } from "express";
import { AppError } from "./errorHandler";
import { verifyToken } from "../utils/jwt";

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    next(new AppError(401, "Missing or invalid Authorization header"));
    return;
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    next(new AppError(401, "Missing token"));
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token"));
  }
}
