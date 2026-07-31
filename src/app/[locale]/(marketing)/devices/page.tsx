import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/marketing/page-hero";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getDeviceIcon } from "@/lib/device-icons";
import { FALLBACK_DEVICES } from "@/lib/fallback-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "devicesPage" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/devices",
    locale,
  });
}

export default async function DevicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "devicesPage" });
  const devices = FALLBACK_DEVICES;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/devices` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => {
              const Icon = getDeviceIcon(device.icon);
              return (
                <Card
                  key={device.id}
                  className="group overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-electric/30 hover:shadow-[0_25px_60px_-25px_rgba(37,99,235,0.35)]"
                >
                  <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-electric/15 via-gold/10 to-transparent">
                    <div className="bg-grid-pattern absolute inset-0 bg-[size:26px_26px] opacity-25 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
                    <div className="glass flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-9 w-9 text-electric-light" strokeWidth={1.5} />
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{device.name}</h3>
                      <Badge variant="success" className="shrink-0 gap-1 whitespace-nowrap">
                        <CheckCircle2 className="h-3 w-3" />
                        {t("compatible")}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {device.instructions}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center">
            <WhatsAppCTAButton
              href={buildGeneralWhatsAppLink(locale)}
              label="WhatsApp"
              size="lg"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
