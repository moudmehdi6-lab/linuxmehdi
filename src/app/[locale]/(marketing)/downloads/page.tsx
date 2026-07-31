import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Info } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
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
  const t = await getTranslations({ locale, namespace: "downloads" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/downloads",
    locale,
  });
}

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "downloads" });
  const devices = FALLBACK_DEVICES;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/downloads` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container className="max-w-3xl">
          <div className="glass mb-10 flex gap-4 rounded-2xl p-6">
            <Info className="h-5 w-5 shrink-0 text-electric-light" />
            <p className="text-sm text-muted-foreground">{t("note")}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {devices.map((device) => {
              const Icon = getDeviceIcon(device.icon);
              return (
                <div
                  key={device.id}
                  className="glass flex flex-col items-center gap-3 rounded-2xl px-4 py-8 text-center"
                >
                  <Icon className="h-8 w-8 text-electric-light" />
                  <span className="text-sm font-medium">{device.name}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/devices">{t("viewSetupInstructions")}</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
