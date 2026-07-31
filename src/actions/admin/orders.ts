"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { isDatabaseConfigured } from "@/lib/db";
import type { OrderStatus } from "@prisma/client";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await requireAdmin();
  if (!isDatabaseConfigured) return;
  await prisma.order.update({ where: { id: orderId }, data: { status } });
  await logAudit(session.user.id, "update_status", "Order", orderId, { status });
  revalidatePath("/admin/orders");
}
