"use server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { newsletterSchema, type NewsletterValues } from "@/lib/validations/newsletter";

type ActionResult = { success: true } | { success: false; error: string };

export async function subscribeToNewsletter(
  values: NewsletterValues,
  locale = "en",
): Promise<ActionResult> {
  const limited = await rateLimit("newsletter", { limit: 8, windowMs: 60 * 60 * 1000 });
  if (!limited.success) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const parsed = newsletterSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: { email: parsed.data.email, locale },
  });

  return { success: true };
}
