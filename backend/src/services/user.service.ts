import type { User } from "@prisma/client";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";

export type PublicUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profession: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  linkedinUrl: string | null;
  websiteUrl: string | null;
  bio: string | null;
  createdAt: Date;
};

export type UpdateProfileInput = {
  firstName?: string;
  lastName?: string;
  profession?: string | null;
  country?: string | null;
  city?: string | null;
  phone?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  bio?: string | null;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profession: user.profession,
    country: user.country,
    city: user.city,
    phone: user.phone,
    linkedinUrl: user.linkedinUrl,
    websiteUrl: user.websiteUrl,
    bio: user.bio,
    createdAt: user.createdAt,
  };
}

function emptyToNull(value: string | null | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return toPublicUser(user);
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  await getUserById(userId);

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.firstName !== undefined
        ? { firstName: input.firstName.trim() }
        : {}),
      ...(input.lastName !== undefined
        ? { lastName: input.lastName.trim() }
        : {}),
      ...(input.profession !== undefined
        ? { profession: emptyToNull(input.profession) }
        : {}),
      ...(input.country !== undefined
        ? { country: emptyToNull(input.country) }
        : {}),
      ...(input.city !== undefined ? { city: emptyToNull(input.city) } : {}),
      ...(input.phone !== undefined ? { phone: emptyToNull(input.phone) } : {}),
      ...(input.linkedinUrl !== undefined
        ? { linkedinUrl: emptyToNull(input.linkedinUrl) }
        : {}),
      ...(input.websiteUrl !== undefined
        ? { websiteUrl: emptyToNull(input.websiteUrl) }
        : {}),
      ...(input.bio !== undefined ? { bio: emptyToNull(input.bio) } : {}),
    },
  });

  return toPublicUser(user);
}
