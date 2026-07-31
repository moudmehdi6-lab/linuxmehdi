import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { BentoFeatureGrid } from "@/components/marketing/bento-feature-grid";
import { FeatureDetailsGrid } from "@/components/marketing/feature-details-grid";
import { CTASection } from "@/components/marketing/cta-section";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "features" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/features",
    locale,
  });
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "features" });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/features` },
        ]}
      />
      <section className="relative overflow-hidden pb-8 pt-10 sm:pt-14 lg:pt-20">
        <AuroraBackground />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-balance text-muted-foreground">{t("subtitle")}</p>
          </div>
        </Container>
      </section>

      <BentoFeatureGrid />
      <FeatureDetailsGrid />
      <CTASection />
    </>
  );
}
