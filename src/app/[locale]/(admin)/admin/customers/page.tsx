import { getTranslations, setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";

export default async function AdminCustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.customers");

  const customers = await safeQuery(
    () =>
      prisma.user.findMany({
        where: { role: "CUSTOMER" },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } },
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
              <th className="px-5 py-3 font-medium">{t("name")}</th>
              <th className="px-5 py-3 font-medium">{t("email")}</th>
              <th className="px-5 py-3 font-medium">{t("joined")}</th>
              <th className="px-5 py-3 text-right font-medium">{t("orders")}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-white/5">
                <td className="px-5 py-4 font-medium">{customer.name ?? "—"}</td>
                <td className="px-5 py-4 text-muted-foreground">{customer.email}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {customer.createdAt.toLocaleDateString(locale)}
                </td>
                <td className="px-5 py-4 text-right">{customer._count.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
