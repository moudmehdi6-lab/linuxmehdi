import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { safeQuery } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.subscription");
  const session = await auth();

  const subscriptions = await safeQuery(
    () =>
      prisma.subscription.findMany({
        where: { userId: session!.user.id },
        include: { plan: true },
        orderBy: { startDate: "desc" },
      }),
    [],
  );

  const active = subscriptions.find((s) => s.status === "ACTIVE");
  const renewLink = buildWhatsAppLink(
    `Hi ${siteConfig.name}! I'd like to renew my subscription${active ? ` (${active.plan.name})` : ""}.`,
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 max-w-xl">
        {!active ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">{t("none")}</p>
              <Button asChild className="mt-6">
                <Link href="/pricing">{t("browsePlans")}</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{active.plan.name}</CardTitle>
                <Badge variant="success">{t("active")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("plan")}</span>
                  <span>
                    {formatPrice(Number(active.plan.price), active.plan.currency, locale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("renews")}</span>
                  <span>{active.endDate.toLocaleDateString(locale)}</span>
                </div>
              </div>
              <WhatsAppCTAButton href={renewLink} label={t("renewCta")} className="mt-6 w-full" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
