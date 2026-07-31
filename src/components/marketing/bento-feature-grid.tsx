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
    <section className="relative py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge>{t("eyebrow")}</Badge>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 text-balance text-lg text-muted-foreground"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={`bento-card group ${item.span ?? ""}`}
              >
                <Icon
                  className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-white/[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  strokeWidth={1}
                />
                <div className="card-glow-icon">
                  <Icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-6 text-lg font-semibold">
                  {t(`items.${item.key}.title`)}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${item.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
