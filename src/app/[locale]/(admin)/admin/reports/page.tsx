import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { safeQuery } from "@/lib/db";

export default async function AdminReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.reports");
  const orders = await safeQuery(() => prisma.order.findMany({ include: { plan: true } }), []);

  const now = new Date();
  const months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
    return { label: d.toLocaleDateString(locale, { month: "long", year: "numeric" }), year: d.getFullYear(), month: d.getMonth(), orders: 0, revenue: 0 };
  });

  for (const order of orders) {
    const bucket = months.find(
      (m) => m.year === order.createdAt.getFullYear() && m.month === order.createdAt.getMonth(),
    );
    if (bucket) {
      bucket.orders += 1;
      bucket.revenue += Number(order.total);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Month</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 text-right font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.label} className="border-t border-white/5">
                <td className="px-5 py-4 font-medium">{m.label}</td>
                <td className="px-5 py-4">{m.orders}</td>
                <td className="px-5 py-4 text-right">{formatPrice(m.revenue, "EUR", locale)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
