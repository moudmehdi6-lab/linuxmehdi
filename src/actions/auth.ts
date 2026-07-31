"use server";

import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterValues,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/lib/validations/auth";

const RESET_PREFIX = "reset:";
const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 60 * 60 * 1000;

type ActionResult = { success: true } | { success: false; error: string };

export async function registerUser(values: RegisterValues): Promise<ActionResult> {
  const limited = await rateLimit("register", { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limited.success) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { name, email, passwordHash, role: "CUSTOMER" },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + VERIFICATION_TTL_MS) },
  });
  await sendVerificationEmail(email, token);

  return { success: true };
}

export async function requestPasswordReset(
  values: ForgotPasswordValues,
): Promise<ActionResult> {
  const limited = await rateLimit("forgot-password", { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limited.success) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const parsed = forgotPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always report success so we don't leak which emails have accounts.
  if (!user) return { success: true };

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: {
      identifier: `${RESET_PREFIX}${email}`,
      token,
      expires: new Date(Date.now() + RESET_TTL_MS),
    },
  });
  await sendPasswordResetEmail(email, token);

  return { success: true };
}

export async function resetPassword(values: ResetPasswordValues): Promise<ActionResult> {
  const limited = await rateLimit("reset-password", { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!limited.success) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { token, password } = parsed.data;
  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || !record.identifier.startsWith(RESET_PREFIX) || record.expires < new Date()) {
    return { success: false, error: "This reset link is invalid or has expired." };
  }

  const email = record.identifier.slice(RESET_PREFIX.length);
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({ where: { email }, data: { passwordHash } });
  await prisma.verificationToken.delete({ where: { token } });

  return { success: true };
}

export async function verifyEmailToken(token: string): Promise<ActionResult> {
  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record || record.identifier.startsWith(RESET_PREFIX) || record.expires < new Date()) {
    return { success: false, error: "This verification link is invalid or has expired." };
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token } });

  return { success: true };
}
