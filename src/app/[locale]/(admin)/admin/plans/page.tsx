import { getTranslations, setRequestLocale } from "next-intl/server";
import { Plus, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlanFormDialog } from "@/components/admin/plan-form-dialog";
import { DeleteButton } from "@/components/admin/delete-button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { safeQuery } from "@/lib/db";
import { deletePlan } from "@/actions/admin/plans";

export default async function AdminPlansPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.plans");
  const plans = await safeQuery(
    () => prisma.plan.findMany({ orderBy: { sortOrder: "asc" } }),
    [],
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <PlanFormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" />
              {t("newPlan")}
            </Button>
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <div key={plan.id} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold">{plan.name}</div>
                <div className="mt-1 text-xl font-bold">
                  {formatPrice(Number(plan.price), plan.currency, locale)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <PlanFormDialog
                  plan={plan}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />
                <DeleteButton id={plan.id} action={deletePlan} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {plan.badge !== "NONE" && <Badge variant="electric">{plan.badge}</Badge>}
              <Badge variant={plan.isActive ? "success" : "outline"}>
                {plan.isActive ? t("active") : "Inactive"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
