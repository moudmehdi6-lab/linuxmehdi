import { getTranslations, setRequestLocale } from "next-intl/server";
import { AffiliateStatusSelect } from "@/components/admin/affiliate-status-select";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { safeQuery } from "@/lib/db";

export default async function AdminAffiliatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.affiliates");
  const affiliates = await safeQuery(
    () => prisma.affiliate.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }),
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
              <th className="px-5 py-3 font-medium">{t("affiliate")}</th>
              <th className="px-5 py-3 font-medium">{t("code")}</th>
              <th className="px-5 py-3 font-medium">{t("commission")}</th>
              <th className="px-5 py-3 font-medium">{t("earnings")}</th>
              <th className="px-5 py-3 font-medium">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id} className="border-t border-white/5">
                <td className="px-5 py-4">
                  <div className="font-medium">{affiliate.user.name ?? affiliate.user.email}</div>
                  <div className="text-xs text-muted-foreground">{affiliate.user.email}</div>
                </td>
                <td className="px-5 py-4 font-mono">{affiliate.code}</td>
                <td className="px-5 py-4">{Number(affiliate.commissionRate)}%</td>
                <td className="px-5 py-4">{formatPrice(Number(affiliate.totalEarnings), "EUR", locale)}</td>
                <td className="px-5 py-4">
                  <AffiliateStatusSelect affiliateId={affiliate.id} status={affiliate.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {affiliates.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No affiliates yet.</p>
        )}
      </div>
    </div>
  );
}
