import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { FaqBrowser } from "@/components/marketing/faq-browser";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { FALLBACK_FAQS } from "@/lib/fallback-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/faq",
    locale,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faqPage" });
  const faqs = await safeQuery(
    () => prisma.fAQ.findMany({ orderBy: { sortOrder: "asc" } }),
    FALLBACK_FAQS,
  );

  return (
    <>
      <FaqJsonLd items={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/faq` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container className="max-w-3xl">
          <FaqBrowser faqs={faqs} />
        </Container>
      </section>
    </>
  );
}
