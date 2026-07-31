import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2, ShoppingBag, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function DashboardOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");
  const session = await auth();
  const userId = session!.user.id;

  const [subscription, orders, unreadCount] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId, status: "ACTIVE" },
      include: { plan: true },
      orderBy: { endDate: "desc" },
    }),
    prisma.order.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">
        {t("welcome", { name: session!.user.name ?? session!.user.email ?? "" })}
      </h1>
      <p className="mt-1 text-muted-foreground">{t("overview.subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <CheckCircle2 className="h-5 w-5 text-gold" />
            <CardTitle className="text-sm">{t("overview.subscriptionStatus")}</CardTitle>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <>
                <div className="text-lg font-semibold">{subscription.plan.name}</div>
                <div className="text-xs text-muted-foreground">
                  {t("subscription.renews")}{" "}
                  {subscription.endDate.toLocaleDateString(locale)}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">{t("overview.noSubscription")}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <ShoppingBag className="h-5 w-5 text-electric-light" />
            <CardTitle className="text-sm">{t("overview.recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <Bell className="h-5 w-5 text-gold" />
            <CardTitle className="text-sm">{t("overview.unreadNotifications")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{unreadCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">{t("overview.recentOrders")}</h2>
        {orders.length === 0 ? (
          <div className="glass mt-4 rounded-2xl p-6 text-center text-sm text-muted-foreground">
            {t("overview.noOrders")}
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="glass flex items-center justify-between rounded-xl px-5 py-4"
              >
                <div>
                  <div className="font-medium">{order.plan.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {order.createdAt.toLocaleDateString(locale)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatPrice(Number(order.total), order.plan.currency, locale)}
                  </div>
                  <div className="text-xs text-muted-foreground">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!subscription && (
        <Button asChild className="mt-8">
          <Link href="/pricing">{t("subscription.browsePlans")}</Link>
        </Button>
      )}
    </div>
  );
}
