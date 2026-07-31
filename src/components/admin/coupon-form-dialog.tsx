"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { Coupon } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { couponFormSchema, type CouponFormValues } from "@/lib/validations/admin";
import { saveCoupon } from "@/actions/admin/coupons";

export function CouponFormDialog({
  coupon,
  trigger,
}: {
  coupon?: Coupon;
  trigger: React.ReactNode;
}) {
  const t = useTranslations("admin.coupons");
  const tCommon = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: coupon
      ? {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: Number(coupon.discountValue),
          maxUses: coupon.maxUses ?? undefined,
          expiresAt: coupon.expiresAt
            ? coupon.expiresAt.toISOString().slice(0, 10)
            : undefined,
          isActive: coupon.isActive,
        }
      : {
          code: "",
          discountType: "PERCENT",
          discountValue: 10,
          isActive: true,
        },
  });

  const onSubmit = async (values: CouponFormValues) => {
    setError(null);
    const result = await saveCoupon(values);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{coupon ? t("title") : t("newCoupon")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register("id")} />
          <div>
            <Label htmlFor="code">{t("code")}</Label>
            <Input id="code" className="mt-2 uppercase" {...register("code")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountType">{t("type")}</Label>
              <select
                id="discountType"
                className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm"
                {...register("discountType")}
              >
                <option value="PERCENT" className="bg-obsidian">
                  Percent
                </option>
                <option value="FIXED" className="bg-obsidian">
                  Fixed
                </option>
              </select>
            </div>
            <div>
              <Label htmlFor="discountValue">{t("value")}</Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                className="mt-2"
                {...register("discountValue")}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxUses">{t("uses")}</Label>
              <Input id="maxUses" type="number" className="mt-2" {...register("maxUses")} />
            </div>
            <div>
              <Label htmlFor="expiresAt">{t("expires")}</Label>
              <Input id="expiresAt" type="date" className="mt-2" {...register("expiresAt")} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            {t("active")}
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {tCommon("save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
