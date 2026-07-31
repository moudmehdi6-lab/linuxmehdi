"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  updateProfileSchema,
  changePasswordSchema,
  createTicketSchema,
  replyTicketSchema,
  type UpdateProfileValues,
  type ChangePasswordValues,
  type CreateTicketValues,
  type ReplyTicketValues,
} from "@/lib/validations/dashboard";

type ActionResult = { success: true } | { success: false; error: string };

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function updateProfile(values: UpdateProfileValues): Promise<ActionResult> {
  const parsed = updateProfileSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await requireUserId();
  await prisma.user.update({ where: { id: userId }, data: { name: parsed.data.name } });
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function changePassword(values: ChangePasswordValues): Promise<ActionResult> {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await requireUserId();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.passwordHash) {
    return { success: false, error: "This account doesn't use a password." };
  }

  const isValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { success: true };
}

export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/notifications");
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const userId = await requireUserId();
  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
  revalidatePath("/dashboard/notifications");
  return { success: true };
}

export async function createSupportTicket(
  values: CreateTicketValues,
): Promise<ActionResult & { ticketId?: string }> {
  const parsed = createTicketSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await requireUserId();
  const ticket = await prisma.supportTicket.create({
    data: {
      userId,
      subject: parsed.data.subject,
      messages: { create: { senderId: userId, message: parsed.data.message } },
    },
  });

  revalidatePath("/dashboard/support");
  return { success: true, ticketId: ticket.id };
}

export async function replyToTicket(values: ReplyTicketValues): Promise<ActionResult> {
  const parsed = replyTicketSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const userId = await requireUserId();
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: parsed.data.ticketId, userId },
  });
  if (!ticket) return { success: false, error: "Ticket not found." };

  await prisma.supportMessage.create({
    data: { ticketId: ticket.id, senderId: userId, message: parsed.data.message },
  });
  await prisma.supportTicket.update({
    where: { id: ticket.id },
    data: { status: ticket.status === "CLOSED" ? "OPEN" : ticket.status },
  });

  revalidatePath(`/dashboard/support/${ticket.id}`);
  return { success: true };
}
