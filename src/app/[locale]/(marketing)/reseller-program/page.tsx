import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Tags, Server, Headset, SlidersHorizontal, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const benefits: { key: string; icon: LucideIcon }[] = [
  { key: "pricing", icon: Tags },
  { key: "infrastructure", icon: Server },
  { key: "support", icon: Headset },
  { key: "flexibility", icon: SlidersHorizontal },
];

function buildResellerWhatsAppMessage(locale: string) {
  const messages: Record<string, string> = {
    en: `Hi ${siteConfig.name}! I'd like to learn more about the reseller program.`,
  };
  return messages[locale] ?? messages.en!;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resellerProgram" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/reseller-program",
    locale,
  });
}

export default async function ResellerProgramPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resellerProgram" });
  const inquireLink = buildWhatsAppLink(buildResellerWhatsAppMessage(locale));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/reseller-program` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <div className="mt-8 flex justify-center">
          <WhatsAppCTAButton href={inquireLink} label={t("cta")} size="lg" />
        </div>
      </PageHero>

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <h2 className="text-center font-display text-2xl font-semibold">
            {t("benefitsTitle")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.key} className="bento-card">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/15">
                    <Icon className="h-5 w-5 text-electric-light" />
                  </div>
                  <h3 className="mt-5 font-semibold">
                    {t(`benefits.${benefit.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`benefits.${benefit.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
