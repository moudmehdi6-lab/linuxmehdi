import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, Sparkles, Headset, Eye, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CTASection } from "@/components/marketing/cta-section";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const values: { key: string; icon: LucideIcon }[] = [
  { key: "reliability", icon: ShieldCheck },
  { key: "simplicity", icon: Sparkles },
  { key: "support", icon: Headset },
  { key: "transparency", icon: Eye },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/about",
    locale,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const storyParagraphs = t.raw("storyParagraphs") as string[];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/about` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-14 lg:pb-20">
        <Container className="max-w-3xl">
          <h2 className="text-center font-display text-2xl font-semibold">
            {t("storyTitle")}
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            {storyParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <h2 className="text-center font-display text-2xl font-semibold">
            {t("valuesTitle")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.key} className="bento-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-electric/20">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mt-5 font-semibold">{t(`values.${value.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`values.${value.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
