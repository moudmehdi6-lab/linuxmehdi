import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalSection } from "@/components/legal/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const UPDATED_DATE = "July 1, 2026";

const sections: LegalSection[] = [
  {
    heading: "1. Acceptance of terms",
    paragraphs: [
      `By accessing or using the ${siteConfig.name} website or subscribing to our service, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.`,
    ],
  },
  {
    heading: "2. Description of service",
    paragraphs: [
      `${siteConfig.name} provides streaming technology infrastructure and subscription access to a content delivery platform. We are an independent streaming technology provider and are not affiliated with, endorsed by, or partnered with any broadcaster, channel operator, sports league, or streaming platform referenced informally in conversation with our support team.`,
    ],
  },
  {
    heading: "3. Ordering and account access",
    paragraphs: [
      "Subscriptions are arranged primarily via WhatsApp. By sending an order message, you confirm the plan details are accurate and authorize us to set up the corresponding subscription. Access credentials or activation details are provided after order confirmation.",
    ],
  },
  {
    heading: "4. Acceptable use",
    paragraphs: ["You agree not to:"],
    list: [
      "Share, resell, or sublicense your subscription access without our written consent",
      "Attempt to reverse-engineer, disrupt, or gain unauthorized access to our infrastructure",
      "Use the service for any unlawful purpose",
      "Use automated tools to scrape or overload our website or systems",
    ],
  },
  {
    heading: "5. Service availability",
    paragraphs: [
      "We work to maintain high availability but do not guarantee uninterrupted, error-free service. Scheduled maintenance and unforeseen technical issues may occasionally affect access; our Status Page reflects current system health.",
    ],
  },
  {
    heading: "6. Pricing and changes",
    paragraphs: [
      "Plan pricing is displayed on our Pricing page and confirmed at the time of order. We reserve the right to update pricing for future subscription periods; changes will not retroactively apply to an already-active term.",
    ],
  },
  {
    heading: "7. Termination",
    paragraphs: [
      "We may suspend or terminate access for accounts found in violation of these Terms, including unauthorized resale or abuse of the service. You may stop using the service at any time by not renewing your subscription.",
    ],
  },
  {
    heading: "8. Limitation of liability",
    paragraphs: [
      `To the maximum extent permitted by law, ${siteConfig.name} shall not be liable for indirect, incidental, or consequential damages arising from use of the service.`,
    ],
  },
  {
    heading: "9. Changes to these terms",
    paragraphs: [
      "We may revise these Terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the revised Terms.",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms" });

  return buildMetadata({
    title: t("title"),
    description: `${siteConfig.name} Terms of Service.`,
    path: "/terms",
    locale,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.terms" });

  return (
    <LegalPageLayout
      title={t("title")}
      updatedLabel={t("updated")}
      updatedDate={UPDATED_DATE}
      intro={`These Terms of Service govern your use of the ${siteConfig.name} website and subscription service.`}
      sections={sections}
    />
  );
}
