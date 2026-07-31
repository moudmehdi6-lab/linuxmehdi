"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isDatabaseConfigured } from "@/lib/db";
import { planFormSchema, type PlanFormValues } from "@/lib/validations/admin";

type ActionResult = { success: true } | { success: false; error: string };

const DB_UNAVAILABLE_ERROR = "This feature isn't available right now. Please try again later.";

export async function savePlan(values: PlanFormValues): Promise<ActionResult> {
  const parsed = planFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
  if (!isDatabaseConfigured) return { success: false, error: DB_UNAVAILABLE_ERROR };
  const { id, features, ...rest } = parsed.data;
  const featureList = features
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  const data = { ...rest, features: featureList };

  if (id) {
    await prisma.plan.update({ where: { id }, data });
    await logAudit(session.user.id, "update", "Plan", id, data);
  } else {
    const created = await prisma.plan.create({ data: { ...data, sortOrder: 99 } });
    await logAudit(session.user.id, "create", "Plan", created.id, data);
  }

  revalidatePath("/admin/plans");
  return { success: true };
}

export async function deletePlan(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!isDatabaseConfigured) return { success: false, error: DB_UNAVAILABLE_ERROR };

  await prisma.plan.delete({ where: { id } }).catch(() => null);
  await logAudit(session.user.id, "delete", "Plan", id);
  revalidatePath("/admin/plans");
  return { success: true };
}
