import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { siteConfig, plans } from "@/lib/site-config";
import { FALLBACK_FAQS } from "@/lib/fallback-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/pricing",
    locale,
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing" });

  const pricingFaqs = FALLBACK_FAQS.filter((faq) => faq.category === "pricing");

  return (
    <>
      <FaqJsonLd items={pricingFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/pricing` },
        ]}
      />
      <section className="relative overflow-hidden pb-10 pt-10 sm:pb-14 sm:pt-14 lg:pb-20 lg:pt-20">
        <AuroraBackground />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-balance text-muted-foreground">{t("subtitle")}</p>
          </div>

          <div className="mt-10 sm:mt-12 lg:mt-16">
            <PricingGrid plans={plans} />
          </div>

          <div className="glass mx-auto mt-10 max-w-xl rounded-2xl px-6 py-6 text-center sm:mt-12 sm:px-8 sm:py-8 lg:mt-16">
            <p className="text-muted-foreground">{t("guarantee")}</p>
            <div className="mt-6 flex justify-center">
              <WhatsAppCTAButton
                href={buildGeneralWhatsAppLink(locale)}
                label="WhatsApp"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12 lg:py-20">
        <Container className="max-w-3xl">
          <h2 className="text-center font-display text-2xl font-semibold">
            {t("faqTitle")}
          </h2>
          <Accordion type="single" collapsible className="mt-8">
            {pricingFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </section>
    </>
  );
}
