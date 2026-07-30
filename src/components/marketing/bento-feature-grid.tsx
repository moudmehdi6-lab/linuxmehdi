"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Zap,
  ShieldCheck,
  Tv,
  Sparkles,
  Headset,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const items: { key: string; icon: LucideIcon; span?: string }[] = [
  { key: "speed", icon: Zap, span: "md:col-span-2" },
  { key: "reliability", icon: ShieldCheck },
  { key: "devices", icon: Tv },
  { key: "quality", icon: Sparkles, span: "md:col-span-2" },
  { key: "support", icon: Headset },
  { key: "security", icon: Lock },
];

export function BentoFeatureGrid() {
  const t = useTranslations("home.features");

  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-balance text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`bento-card group ${item.span ?? ""}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-gold/20 to-electric/20">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`items.${item.key}.description`)}
                </p>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
