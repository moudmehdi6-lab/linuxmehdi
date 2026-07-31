import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.log(`\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n[email:dev] ${html}\n`);
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? `${siteConfig.name} <no-reply@iptvlinux.com>`,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${siteConfig.url}/en/verify-email?token=${token}`;
  await sendEmail({
    to: email,
    subject: `Verify your ${siteConfig.name} account`,
    html: `<p>Welcome to ${siteConfig.name}! Confirm your email address to activate your account:</p><p><a href="${url}">${url}</a></p>`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${siteConfig.url}/en/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: `Reset your ${siteConfig.name} password`,
    html: `<p>We received a request to reset your password. This link expires in 1 hour:</p><p><a href="${url}">${url}</a></p><p>If you didn't request this, you can ignore this email.</p>`,
  });
}
