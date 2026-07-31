import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createTicketSchema = z.object({
  subject: z.string().trim().min(3, "Please enter a subject").max(150),
  message: z.string().trim().min(10, "Please describe your issue").max(2000),
});

export const replyTicketSchema = z.object({
  ticketId: z.string().min(1),
  message: z.string().trim().min(1, "Message can't be empty").max(2000),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type CreateTicketValues = z.infer<typeof createTicketSchema>;
export type ReplyTicketValues = z.infer<typeof replyTicketSchema>;
