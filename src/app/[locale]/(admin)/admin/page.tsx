import { getTranslations, setRequestLocale } from "next-intl/server";
import { Users, CreditCard, ShoppingBag, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdersOverTimeChart, PlanDistributionChart } from "@/components/admin/analytics-charts";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminAnalyticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.analytics");

  const [totalUsers, activeSubscriptions, totalOrders, orders] = await Promise.all([
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.order.count(),
    prisma.order.findMany({ include: { plan: true } }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

  const now = new Date();
  const monthBuckets: { month: string; orders: number }[] = Array.from({ length: 6 }).map(
    (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { month: d.toLocaleDateString(locale, { month: "short" }), orders: 0 };
    },
  );
  for (const order of orders) {
    const monthsAgo =
      (now.getFullYear() - order.createdAt.getFullYear()) * 12 +
      (now.getMonth() - order.createdAt.getMonth());
    const index = 5 - monthsAgo;
    if (index >= 0 && index < 6) monthBuckets[index]!.orders += 1;
  }

  const planCounts = new Map<string, number>();
  for (const order of orders) {
    planCounts.set(order.plan.name, (planCounts.get(order.plan.name) ?? 0) + 1);
  }
  const planData = Array.from(planCounts.entries()).map(([name, value]) => ({ name, value }));

  const stats = [
    { label: t("totalUsers"), value: totalUsers.toString(), icon: Users },
    { label: t("activeSubscriptions"), value: activeSubscriptions.toString(), icon: CreditCard },
    { label: t("totalOrders"), value: totalOrders.toString(), icon: ShoppingBag },
    { label: t("totalRevenue"), value: formatPrice(totalRevenue, "EUR", locale), icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <Icon className="h-5 w-5 text-gold" />
                <CardTitle className="text-sm">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("ordersOverTime")}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersOverTimeChart data={monthBuckets} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("planDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            {planData.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <PlanDistributionChart data={planData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
