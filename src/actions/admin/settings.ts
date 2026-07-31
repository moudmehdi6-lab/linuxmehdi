"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import {
  seoSettingsSchema,
  generalSettingsSchema,
  type SeoSettingsValues,
  type GeneralSettingsValues,
} from "@/lib/validations/admin";

type ActionResult = { success: true } | { success: false; error: string };

export async function saveSeoSettings(values: SeoSettingsValues): Promise<ActionResult> {
  const parsed = seoSettingsSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
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
