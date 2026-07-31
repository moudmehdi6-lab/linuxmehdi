"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { Plan } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { planFormSchema, type PlanFormValues } from "@/lib/validations/admin";
import { savePlan } from "@/actions/admin/plans";

export function PlanFormDialog({
  plan,
  trigger,
}: {
  plan?: Plan;
  trigger: React.ReactNode;
}) {
  const t = useTranslations("admin.plans");
  const tCommon = useTranslations("admin");
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: plan
      ? {
          id: plan.id,
          slug: plan.slug,
          name: plan.name,
          durationMonths: plan.durationMonths,
          price: Number(plan.price),
          discountPercent: plan.discountPercent,
          badge: plan.badge,
          features: (plan.features as string[]).join("\n"),
          isActive: plan.isActive,
        }
      : {
          slug: "",
          name: "",
          durationMonths: 1,
          price: 0,
          discountPercent: 0,
          badge: "NONE",
          features: "",
          isActive: true,
        },
  });

  const onSubmit = async (values: PlanFormValues) => {
    setError(null);
    const result = await savePlan(values);
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
          <DialogTitle>{plan ? t("title") : t("newPlan")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <input type="hidden" {...register("id")} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" className="mt-2" {...register("name")} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" className="mt-2" {...register("slug")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">{t("price")}</Label>
              <Input id="price" type="number" step="0.01" className="mt-2" {...register("price")} />
            </div>
            <div>
              <Label htmlFor="durationMonths">{t("duration")}</Label>
              <Input
                id="durationMonths"
                type="number"
                className="mt-2"
                {...register("durationMonths")}
              />
            </div>
            <div>
              <Label htmlFor="discountPercent">{t("discount")}</Label>
              <Input
                id="discountPercent"
                type="number"
                className="mt-2"
                {...register("discountPercent")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="badge">{t("badge")}</Label>
            <select
              id="badge"
              className="focus-ring mt-2 h-11 w-full rounded-lg border border-white/15 bg-white/[0.03] px-4 text-sm"
              {...register("badge")}
            >
              <option value="NONE" className="bg-obsidian">
                None
              </option>
              <option value="MOST_POPULAR" className="bg-obsidian">
                Most Popular
              </option>
              <option value="BEST_VALUE" className="bg-obsidian">
                Best Value
              </option>
            </select>
          </div>
          <div>
            <Label htmlFor="features">{t("features")}</Label>
            <Textarea id="features" className="mt-2" {...register("features")} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4" />
            {t("active")}
          </label>

          {(error || Object.keys(errors).length > 0) && (
            <p className="text-sm text-destructive">
              {error ?? Object.values(errors)[0]?.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {tCommon("save")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
