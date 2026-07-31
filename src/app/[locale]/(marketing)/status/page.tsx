import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2, AlertTriangle, Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/marketing/page-hero";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { FALLBACK_STATUS_INCIDENTS } from "@/lib/fallback-data";

const services = ["streaming", "dashboard", "support", "api"] as const;

const severityIcon = {
  MINOR: Wrench,
  MAJOR: AlertTriangle,
  CRITICAL: AlertTriangle,
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "statusPage" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/status",
    locale,
  });
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "statusPage" });
  const incidents = FALLBACK_STATUS_INCIDENTS.slice(0, 20);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/status` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")}>
        <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {t("allOperational")}
        </div>
      </PageHero>

      <section className="pb-10 sm:pb-12 lg:pb-16">
        <Container className="max-w-2xl">
          <h2 className="text-lg font-semibold">{t("servicesTitle")}</h2>
          <div className="mt-4 space-y-3">
            {services.map((service) => (
              <div
                key={service}
                className="glass flex items-center justify-between rounded-xl px-5 py-4"
              >
                <span className="text-sm font-medium">
                  {t(`services.${service}`)}
                </span>
                <Badge variant="success" className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("operational")}
                </Badge>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container className="max-w-2xl">
          <h2 className="text-lg font-semibold">{t("incidentsTitle")}</h2>
          {incidents.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">{t("noIncidents")}</p>
          ) : (
            <div className="mt-4 space-y-4">
              {incidents.map((incident) => {
                const Icon = severityIcon[incident.severity];
                return (
                  <Card key={incident.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-medium">{incident.title}</h3>
                            <Badge variant="success">{incident.status}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {incident.description}
                          </p>
                          <p className="mt-3 text-xs text-muted-foreground">
                            {incident.startedAt.toLocaleDateString(locale, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
