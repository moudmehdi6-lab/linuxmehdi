"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Check, Star, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildPlanWhatsAppLink } from "@/lib/whatsapp";
import { plans } from "@/lib/site-config";
import { cn, formatPrice } from "@/lib/utils";

export function PricingGrid() {
  const t = useTranslations("pricing");
  const locale = useLocale();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan, index) => {
        const isFeatured = plan.badge !== "NONE";
        return (
          <motion.div
            key={plan.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
          >
            <Card
              className={cn(
                "relative flex h-full flex-col p-6",
                isFeatured
                  ? "border-gold/50 bg-gradient-to-b from-gold/[0.08] to-transparent"
                  : "border-white/10",
              )}
            >
              {plan.badge === "MOST_POPULAR" && (
                <Badge className="absolute -top-3 left-6 flex items-center gap-1">
                  <Star className="h-3 w-3" /> {t("mostPopular")}
                </Badge>
              )}
              {plan.badge === "BEST_VALUE" && (
                <Badge
                  variant="electric"
                  className="absolute -top-3 left-6 flex items-center gap-1"
                >
                  <Trophy className="h-3 w-3" /> {t("bestValue")}
                </Badge>
              )}

              <h3 className="mt-4 text-lg font-semibold">{plan.name}</h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">
                  {formatPrice(plan.price, plan.currency, locale)}
                </span>
                <span className="text-sm text-muted-foreground">
                  /{t("perPlan")}
                </span>
              </div>

              {plan.discountPercent > 0 && (
                <div className="mt-2 text-sm font-medium text-emerald-400">
                  {t("save", { percent: plan.discountPercent })}
                </div>
              )}

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <WhatsAppCTAButton
                href={buildPlanWhatsAppLink(plan, locale)}
                label={t("order")}
                className="mt-8 w-full"
              />
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
