"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { mediaAssetFormSchema, type MediaAssetFormValues } from "@/lib/validations/admin";

type ActionResult = { success: true } | { success: false; error: string };

export async function addMediaAsset(values: MediaAssetFormValues): Promise<ActionResult> {
  const parsed = mediaAssetFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
  const created = await prisma.mediaAsset.create({
    data: { ...parsed.data, uploadedById: session.user.id },
  });
  await logAudit(session.user.id, "create", "MediaAsset", created.id);

  revalidatePath("/admin/media");
  return { success: true };
}

export async function deleteMediaAsset(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  await prisma.mediaAsset.delete({ where: { id } }).catch(() => null);
  await logAudit(session.user.id, "delete", "MediaAsset", id);
  revalidatePath("/admin/media");
  return { success: true };
}
