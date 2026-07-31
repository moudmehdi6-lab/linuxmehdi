"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isDatabaseConfigured } from "@/lib/db";
import { couponFormSchema, type CouponFormValues } from "@/lib/validations/admin";

type ActionResult = { success: true } | { success: false; error: string };

const DB_UNAVAILABLE_ERROR = "This feature isn't available right now. Please try again later.";

export async function saveCoupon(values: CouponFormValues): Promise<ActionResult> {
  const parsed = couponFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await requireAdmin();
  if (!isDatabaseConfigured) return { success: false, error: DB_UNAVAILABLE_ERROR };
  const { id, expiresAt, maxUses, ...rest } = parsed.data;
  const data = {
    ...rest,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    maxUses: maxUses ?? null,
  };

  if (id) {
    await prisma.coupon.update({ where: { id }, data });
    await logAudit(session.user.id, "update", "Coupon", id, data);
  } else {
    const created = await prisma.coupon.create({ data });
    await logAudit(session.user.id, "create", "Coupon", created.id, data);
  }

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!isDatabaseConfigured) return { success: false, error: DB_UNAVAILABLE_ERROR };

  await prisma.coupon.delete({ where: { id } }).catch(() => null);
  await logAudit(session.user.id, "delete", "Coupon", id);
  revalidatePath("/admin/coupons");
  return { success: true };
}
