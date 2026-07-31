import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.orders");
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      {orders.length === 0 ? (
        <div className="glass mt-8 rounded-2xl p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">{t("plan")}</th>
                <th className="px-5 py-3 font-medium">{t("date")}</th>
                <th className="px-5 py-3 font-medium">{t("status")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("total")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/5">
                  <td className="px-5 py-4 font-medium">{order.plan.name}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {order.createdAt.toLocaleDateString(locale)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="outline">{order.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {formatPrice(Number(order.total), order.plan.currency, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
