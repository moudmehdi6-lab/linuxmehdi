import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CouponFormDialog } from "@/components/admin/coupon-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";
import { deleteCoupon } from "@/actions/admin/coupons";

export default async function AdminCouponsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.coupons");
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <CouponFormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              {t("newCoupon")}
            </Button>
          }
        />
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">{t("code")}</th>
              <th className="px-5 py-3 font-medium">{t("value")}</th>
              <th className="px-5 py-3 font-medium">{t("uses")}</th>
              <th className="px-5 py-3 font-medium">{t("expires")}</th>
              <th className="px-5 py-3 font-medium">{t("active")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-t border-white/5">
                <td className="px-5 py-4 font-mono font-medium">{coupon.code}</td>
                <td className="px-5 py-4">
                  {coupon.discountType === "PERCENT"
                    ? `${coupon.discountValue}%`
                    : `€${coupon.discountValue}`}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {coupon.expiresAt ? coupon.expiresAt.toLocaleDateString(locale) : "—"}
                </td>
                <td className="px-5 py-4">
                  <Badge variant={coupon.isActive ? "success" : "outline"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <CouponFormDialog
                      coupon={coupon}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DeleteButton id={coupon.id} action={deleteCoupon} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <p className="p-8 text-center text-sm text-muted-foreground">No coupons yet.</p>
        )}
      </div>
    </div>
  );
}
