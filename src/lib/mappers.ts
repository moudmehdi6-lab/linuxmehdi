import type { Plan as PrismaPlan } from "@prisma/client";
import type { SitePlan } from "@/lib/site-config";

export function toSitePlan(plan: PrismaPlan): SitePlan {
  return {
    slug: plan.slug,
    name: plan.name,
    durationMonths: plan.durationMonths,
    price: Number(plan.price),
    currency: plan.currency,
    discountPercent: plan.discountPercent,
    badge: plan.badge,
    features: (plan.features as string[]) ?? [],
  };
}
