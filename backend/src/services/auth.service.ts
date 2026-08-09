import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";
import { signToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

function toPublicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
  };
}

export async function registerUser(input: RegisterInput) {
  const email = input.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
    },
  });

  const token = signToken({ userId: user.id, email: user.email });

  return { user: toPublicUser(user), token };
}

export async function loginUser(input: LoginInput) {
  const email = input.email.toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, email: user.email });

  return { user: toPublicUser(user), token };
}
