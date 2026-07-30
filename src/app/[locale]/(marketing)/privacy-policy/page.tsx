import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalSection } from "@/components/legal/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const UPDATED_DATE = "July 1, 2026";

const sections: LegalSection[] = [
  {
    heading: "1. Information we collect",
    paragraphs: [
      "We collect information you provide directly to us, such as when you message us on WhatsApp to order a plan, fill out our contact form, or create an account in your customer dashboard. This may include your name, email address, phone number, and the content of your messages to us.",
      "We also collect limited technical information automatically when you use our website, including your browser type, device type, general location (derived from IP address), and pages visited, used to keep the site secure and to understand how it's used.",
    ],
  },
  {
    heading: "2. How we use your information",
    paragraphs: ["We use the information we collect to:"],
    list: [
      "Set up and manage your subscription",
      "Respond to support requests and questions",
      "Send service-related notifications (billing, renewal reminders, account updates)",
      "Maintain the security and reliability of our platform",
      "Improve our website and service offering",
    ],
  },
  {
    heading: "3. WhatsApp communications",
    paragraphs: [
      "Because ordering happens via WhatsApp, messages you send us are processed through WhatsApp's own platform and are subject to WhatsApp's privacy policy in addition to this one. We only use the content of those conversations to process your order and provide support — we do not sell or share this information with third parties for marketing purposes.",
    ],
  },
  {
    heading: "4. Cookies and similar technologies",
    paragraphs: [
      "We use a small number of cookies to remember your language and theme preference and to keep you signed in to your dashboard. See our Cookie Policy for full details and how to manage your preferences.",
    ],
  },
  {
    heading: "5. Data retention",
    paragraphs: [
      "We retain account and order information for as long as your account is active and for a reasonable period afterward to comply with legal obligations, resolve disputes, and enforce our agreements.",
    ],
  },
  {
    heading: "6. Your rights",
    paragraphs: [
      "Depending on where you live, you may have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, contact us using the details on our Contact page.",
    ],
  },
  {
    heading: "7. Security",
    paragraphs: [
      "We use industry-standard technical and organizational measures, including encrypted connections and access controls, to protect your information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "8. Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. Material changes will be reflected by an updated revision date at the top of this page.",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacyPolicy" });

  return buildMetadata({
    title: t("title"),
    description: `${siteConfig.name} Privacy Policy — how we collect, use, and protect your information.`,
    path: "/privacy-policy",
    locale,
    noIndex: false,
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.privacyPolicy" });

  return (
    <LegalPageLayout
      title={t("title")}
      updatedLabel={t("updated")}
      updatedDate={UPDATED_DATE}
      intro={`This Privacy Policy explains how ${siteConfig.name} collects, uses, and protects information when you visit our website or use our service.`}
      sections={sections}
    />
  );
}
