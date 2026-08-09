import type { Request, Response } from "express";
import { AppError } from "../middleware/errorHandler";
import * as formatService from "../services/format.service";

export async function listFormats(_req: Request, res: Response): Promise<void> {
  const formats = await formatService.listActiveFormats();
  res.status(200).json({ data: formats });
}

export async function getFormat(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  if (typeof id !== "string" || !id) {
    throw new AppError(400, "Missing id");
  }

  const format = await formatService.getFormatById(id);
  res.status(200).json({ data: format });
}
