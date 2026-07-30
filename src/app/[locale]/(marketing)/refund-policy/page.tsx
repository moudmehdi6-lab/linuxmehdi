import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalSection } from "@/components/legal/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const UPDATED_DATE = "July 1, 2026";

const sections: LegalSection[] = [
  {
    heading: "1. Digital subscription service",
    paragraphs: [
      `Plans purchased through ${siteConfig.name} grant access to a digital streaming service. Because activation is immediate and access begins as soon as a plan is set up, refund eligibility is limited as described below.`,
    ],
  },
  {
    heading: "2. Eligibility for a refund",
    paragraphs: [
      "You may be eligible for a full refund if you contact us within 24 hours of activation and have not yet used the service (no login/streaming activity recorded). If a technical issue on our side prevents the service from working and we are unable to resolve it within a reasonable time, you are also eligible for a full or prorated refund.",
    ],
  },
  {
    heading: "3. Non-refundable situations",
    paragraphs: ["Refunds are not available in the following cases:"],
    list: [
      "The service has been actively used beyond the 24-hour eligibility window",
      "Access issues caused by incompatible or unsupported third-party hardware not disclosed at the time of order",
      "Change of mind after successful setup and use",
      "Violation of our Terms of Service resulting in account suspension",
    ],
  },
  {
    heading: "4. How to request a refund",
    paragraphs: [
      "To request a refund, message us on WhatsApp with your order details and the reason for the request. We aim to respond within 24 hours and process approved refunds within 5–7 business days using the original payment method discussed at checkout.",
    ],
  },
  {
    heading: "5. Plan changes instead of a refund",
    paragraphs: [
      "If you're not fully satisfied but the service is otherwise working, we're happy to discuss switching you to a different plan length or troubleshooting further before processing a refund.",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.refundPolicy" });

  return buildMetadata({
    title: t("title"),
    description: `${siteConfig.name} Refund Policy.`,
    path: "/refund-policy",
    locale,
  });
}

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.refundPolicy" });

  return (
    <LegalPageLayout
      title={t("title")}
      updatedLabel={t("updated")}
      updatedDate={UPDATED_DATE}
      intro={`This Refund Policy explains when refunds are available for ${siteConfig.name} subscriptions.`}
      sections={sections}
    />
  );
}
