import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { safeQuery } from "@/lib/db";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.orders");

  const orders = await safeQuery(
    () =>
      prisma.order.findMany({
        include: { plan: true, user: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    [],
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">{t("customer")}</th>
              <th className="px-5 py-3 font-medium">{t("plan")}</th>
              <th className="px-5 py-3 font-medium">{t("date")}</th>
              <th className="px-5 py-3 font-medium">{t("status")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("total")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-white/5">
                <td className="px-5 py-4">
                  <div className="font-medium">{order.user.name ?? order.user.email}</div>
                  <div className="text-xs text-muted-foreground">{order.user.email}</div>
                </td>
                <td className="px-5 py-4">{order.plan.name}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {order.createdAt.toLocaleDateString(locale)}
                </td>
                <td className="px-5 py-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  {formatPrice(Number(order.total), order.plan.currency, locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
