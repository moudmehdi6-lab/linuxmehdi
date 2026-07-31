import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle, Send, KeyRound, PlaySquare } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { CTASection } from "@/components/marketing/cta-section";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const steps = [
  { key: "choose", icon: Send },
  { key: "message", icon: MessageCircle },
  { key: "receive", icon: KeyRound },
  { key: "stream", icon: PlaySquare },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "howItWorks" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/how-it-works",
    locale,
  });
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "howItWorks" });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/how-it-works` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-6 top-0 hidden h-full w-px bg-white/10 sm:block" />
            <div className="space-y-10">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.key} className="relative flex gap-6">
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-electric text-obsidian">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="pt-1.5">
                      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Step {index + 1}
                      </div>
                      <h2 className="mt-1 text-xl font-semibold">
                        {t(`steps.${step.key}.title`)}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {t(`steps.${step.key}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
