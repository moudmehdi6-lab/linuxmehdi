import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageLayout, type LegalSection } from "@/components/legal/legal-page-layout";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const UPDATED_DATE = "July 1, 2026";

const sections: LegalSection[] = [
  {
    heading: "1. What are cookies",
    paragraphs: [
      "Cookies are small text files stored on your device that let a website remember information about your visit, such as your preferences and login state.",
    ],
  },
  {
    heading: "2. Cookies we use",
    paragraphs: ["We keep our cookie footprint minimal and use only what's needed to run the site:"],
    list: [
      "Essential — keeps you signed in to your customer dashboard and protects against cross-site request forgery",
      "Preference — remembers your selected language and light/dark theme",
      "Analytics (optional) — helps us understand aggregate site usage so we can improve the experience",
    ],
  },
  {
    heading: "3. Managing cookies",
    paragraphs: [
      "Most browsers let you block or delete cookies through their settings. Blocking essential cookies may prevent parts of the dashboard from working correctly. We do not use cookies for third-party advertising.",
    ],
  },
  {
    heading: "4. Changes to this policy",
    paragraphs: [
      "We may update this Cookie Policy as our use of cookies evolves. Check back periodically for the latest version.",
    ],
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.cookiePolicy" });

  return buildMetadata({
    title: t("title"),
    description: `${siteConfig.name} Cookie Policy.`,
    path: "/cookie-policy",
    locale,
  });
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.cookiePolicy" });

  return (
    <LegalPageLayout
      title={t("title")}
      updatedLabel={t("updated")}
      updatedDate={UPDATED_DATE}
      intro={`This Cookie Policy explains how ${siteConfig.name} uses cookies and similar technologies.`}
      sections={sections}
    />
  );
}
