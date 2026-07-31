import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Clock, MessageCircle } from "lucide-react";
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
      <section className="relative overflow-hidden py-10 sm:py-16 lg:py-24">
        <AuroraBackground variant="hero" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="gap-1.5 border-gold/20 bg-gold/[0.08]">
              <MessageCircle className="h-3 w-3" />
              {t("eyebrow")}
            </Badge>
            <h1 className="mt-7 text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-balance text-lg text-muted-foreground">{t("subtitle")}</p>
            <div className="mt-6 flex justify-center">
              <span className="glass flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-foreground/80">
                <Clock className="h-3.5 w-3.5 text-gold" />
                {t("responseTime")}
              </span>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-5">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="rounded-3xl bg-gradient-to-b from-[#25D366]/50 via-[#25D366]/15 to-transparent p-[1px] shadow-[0_25px_60px_-30px_rgba(37,211,102,0.5)]">
                <Card className="rounded-3xl border-0 bg-obsidian/90">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/20 ring-1 ring-inset ring-[#25D366]/30">
                      <WhatsAppIcon className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <CardTitle className="mt-3">{t("whatsappTitle")}</CardTitle>
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
              </div>

              <Card className="transition-colors hover:border-electric/30">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/15 ring-1 ring-inset ring-white/10">
                    <Mail className="h-5 w-5 text-electric-light" />
                  </div>
                  <CardTitle className="mt-3">{t("emailTitle")}</CardTitle>
                  <CardDescription>{siteConfig.contactEmail}</CardDescription>
                </CardHeader>
              </Card>
            </div>

            <Card className="lg:col-span-3">
              <CardContent className="pt-8">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
