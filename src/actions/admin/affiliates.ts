"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import type { AffiliateStatus } from "@prisma/client";

export async function updateAffiliateStatus(affiliateId: string, status: AffiliateStatus) {
  const session = await requireAdmin();
  await prisma.affiliate.update({ where: { id: affiliateId }, data: { status } });
  await logAudit(session.user.id, "update_status", "Affiliate", affiliateId, { status });
  revalidatePath("/admin/affiliates");
}
