"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import type { Role } from "@prisma/client";

export async function updateUserRole(userId: string, role: Role) {
  const session = await requireAdmin();
  if (session.user.id === userId) {
    return { success: false as const, error: "You can't change your own role." };
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  await logAudit(session.user.id, "update_role", "User", userId, { role });
  revalidatePath("/admin/roles");
  revalidatePath("/admin/users");
  return { success: true as const };
}
