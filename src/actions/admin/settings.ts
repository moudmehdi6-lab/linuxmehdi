"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isDatabaseConfigured } from "@/lib/db";
import {
  seoSettingsSchema,
  generalSettingsSchema,
  type SeoSettingsValues,
  type GeneralSettingsValues,
} from "@/lib/validations/admin";

type ActionResult = { success: true } | { success: false; error: string };

const DB_UNAVAILABLE_ERROR = "This feature isn't available right now. Please try again later.";

export async function saveSeoSettings(values: SeoSettingsValues): Promise<ActionResult> {
  const parsed = seoSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
  if (!isDatabaseConfigured) return { success: false, error: DB_UNAVAILABLE_ERROR };
  await prisma.siteSettings.upsert({
    where: { key: "seo" },
    update: { value: parsed.data },
    create: { key: "seo", value: parsed.data },
  });
  await logAudit(session.user.id, "update", "SiteSettings", "seo");

  revalidatePath("/admin/seo");
  return { success: true };
}

export async function saveGeneralSettings(
  values: GeneralSettingsValues,
): Promise<ActionResult> {
  const parsed = generalSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
  if (!isDatabaseConfigured) return { success: false, error: DB_UNAVAILABLE_ERROR };

  const { whatsappNumber, contactEmail, twitter, facebook, instagram, telegram } = parsed.data;

  await prisma.siteSettings.upsert({
    where: { key: "general" },
    update: {
      value: {
        whatsappNumber,
        contactEmail,
        socialLinks: { twitter, facebook, instagram, telegram },
      },
    },
    create: {
      key: "general",
      value: {
        whatsappNumber,
        contactEmail,
        socialLinks: { twitter, facebook, instagram, telegram },
      },
    },
  });
  await logAudit(session.user.id, "update", "SiteSettings", "general");

  revalidatePath("/admin/settings");
  return { success: true };
}
