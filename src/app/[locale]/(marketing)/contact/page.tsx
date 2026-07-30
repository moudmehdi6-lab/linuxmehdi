import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { ContactForm } from "@/components/marketing/contact-form";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { WhatsAppIcon } from "@/components/whatsapp/whatsapp-icon";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/contact` },
        ]}
      />
      <section className="relative overflow-hidden py-20">
        <AuroraBackground />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Badge>{t("eyebrow")}</Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-balance text-muted-foreground">{t("subtitle")}</p>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <Card className="border-[#25D366]/30 bg-[#25D366]/[0.06]">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/20">
                    <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  </div>
                  <CardTitle className="mt-2">{t("whatsappTitle")}</CardTitle>
                  <CardDescription>{t("whatsappSubtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <WhatsAppCTAButton
                    href={buildGeneralWhatsAppLink(locale)}
                    label={t("whatsappButton")}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/15">
                    <Mail className="h-5 w-5 text-electric-light" />
                  </div>
                  <CardTitle className="mt-2">{t("emailTitle")}</CardTitle>
                  <CardDescription>{siteConfig.contactEmail}</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="lg:col-span-3">
              <CardContent className="pt-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
