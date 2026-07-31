"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Check, Star, Trophy, Zap, Flame, Crown, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildPlanWhatsAppLink } from "@/lib/whatsapp";
import type { SitePlan } from "@/lib/site-config";
import { cn, formatPrice } from "@/lib/utils";

const planIcons: Record<string, LucideIcon> = {
  "1-month": Zap,
  "3-months": Flame,
  "6-months": Crown,
  "12-months": Trophy,
};

export function PricingGrid({ plans }: { plans: SitePlan[] }) {
  const t = useTranslations("pricing");
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
      {plans.map((plan, index) => {
        const isFeatured = plan.badge !== "NONE";
        const isBestValue = plan.badge === "BEST_VALUE";
        const PlanIcon = planIcons[plan.slug] ?? Zap;

        return (
          <motion.div
            key={plan.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={cn("relative h-full", isFeatured && "lg:-mt-4")}
          >
            <div
              className={cn(
                "group relative h-full rounded-3xl p-[1px] transition-transform duration-300",
                isFeatured
                  ? "bg-gradient-to-b from-gold via-gold/40 to-transparent shadow-[0_30px_70px_-30px_rgba(212,175,55,0.45)] hover:-translate-y-1.5"
                  : "bg-white/10 hover:-translate-y-1",
              )}
            >
              <div
                className={cn(
                  "flex h-full flex-col rounded-3xl p-7",
                  isFeatured ? "bg-obsidian/95" : "bg-card",
                )}
              >
                {isFeatured && (
                  <Badge
                    variant={isBestValue ? "electric" : "default"}
                    className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap px-3.5 py-1.5 shadow-lg"
                  >
                    {isBestValue ? <Trophy className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                    {isBestValue ? t("bestValue") : t("mostPopular")}
                  </Badge>
                )}

                <div
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset ring-white/10",
                    isFeatured
                      ? "bg-gradient-to-br from-gold/25 to-electric/20"
                      : "bg-gradient-to-br from-gold/15 to-electric/10",
                  )}
                >
                  <PlanIcon className="h-5 w-5 text-gold" />
                </div>

                <h3 className="mt-5 text-base font-medium text-muted-foreground">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-display text-5xl font-bold tracking-tight",
                      isFeatured && "text-gradient-gold",
                    )}
                  >
                    {formatPrice(plan.price, plan.currency, locale)}
                  </span>
                  <span className="text-sm text-muted-foreground">/{t("perPlan")}</span>
                </div>

                <div className="mt-2.5 h-5">
                  {plan.discountPercent > 0 && (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      {t("save", { percent: plan.discountPercent })}
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/15">
                        <Check className="h-2.5 w-2.5 text-gold" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <WhatsAppCTAButton
                  href={buildPlanWhatsAppLink(plan, locale)}
                  label={t("order")}
                  className={cn("mt-8 w-full", isFeatured && "shadow-lg")}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
