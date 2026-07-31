import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Send, Link2, DollarSign } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/marketing/page-hero";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const steps = [
  { key: "apply", icon: Send },
  { key: "share", icon: Link2 },
  { key: "earn", icon: DollarSign },
] as const;

function buildAffiliateWhatsAppMessage(locale: string) {
  const messages: Record<string, string> = {
    en: `Hi ${siteConfig.name}! I'd like to apply for the affiliate program.`,
  };
  return messages[locale] ?? messages.en!;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affiliateProgram" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/affiliate-program",
    locale,
  });
}

export default async function AffiliateProgramPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "affiliateProgram" });
  const applyLink = buildWhatsAppLink(buildAffiliateWhatsAppMessage(locale));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/affiliate-program` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <div className="mt-8 flex justify-center">
          <WhatsAppCTAButton href={applyLink} label={t("cta")} size="lg" />
        </div>
      </PageHero>

      <section className="pb-10 sm:pb-14 lg:pb-20">
        <Container>
          <h2 className="text-center font-display text-2xl font-semibold">
            {t("howTitle")}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="glass rounded-2xl p-6 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>
                  <div className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Step {index + 1}
                  </div>
                  <h3 className="mt-1 font-semibold">{t(`steps.${step.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`steps.${step.key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>{t("commissionTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("commissionDescription")}</p>
              <div className="mt-6">
                <WhatsAppCTAButton href={applyLink} label={t("cta")} />
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </>
  );
}
