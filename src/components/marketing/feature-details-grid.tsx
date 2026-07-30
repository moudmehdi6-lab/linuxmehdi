"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Globe2, ShieldCheck, Activity, LifeBuoy, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const items: { key: string; icon: LucideIcon }[] = [
  { key: "network", icon: Globe2 },
  { key: "encryption", icon: ShieldCheck },
  { key: "monitoring", icon: Activity },
  { key: "onboarding", icon: LifeBuoy },
];

export function FeatureDetailsGrid() {
  const t = useTranslations("features");

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="electric">{t("detailsEyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("detailsTitle")}
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">
            {t("detailsSubtitle")}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="glass flex gap-4 rounded-2xl p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-electric/15">
                  <Icon className="h-5 w-5 text-electric-light" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {t(`details.${item.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`details.${item.key}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
