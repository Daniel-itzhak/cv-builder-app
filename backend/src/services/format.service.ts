import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export async function listActiveFormats() {
  return prisma.cvFormat.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      thumbnailSchema: true,
      layoutConfig: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function getFormatById(id: string) {
  const format = await prisma.cvFormat.findFirst({
    where: { id, isActive: true },
  });

  if (!format) {
    throw new AppError(404, "Template not found");
  }

  return format;
}
