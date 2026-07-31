"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

const rowKeys = [
  "setup",
  "devices",
  "support",
  "infrastructure",
  "contracts",
  "pricing",
] as const;

export function WhyChooseSection() {
  const t = useTranslations("home.whyChoose");

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">{t("subtitle")}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-10 sm:mt-12 lg:mt-14 max-w-4xl overflow-hidden rounded-3xl border border-white/10"
        >
          <div className="grid grid-cols-[1fr_1.4fr_1.4fr] bg-white/[0.03] text-center sm:grid-cols-[1.2fr_1.4fr_1.4fr]">
            <div className="px-3 py-5 sm:px-4" />
            <div className="border-s border-white/10 px-3 py-5 sm:px-4">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t("themColumn")}
              </span>
            </div>
            <div className="relative border-s border-white/10 px-3 py-5 sm:px-4">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gold/10 to-transparent" />
              <span className="relative text-[0.65rem] font-semibold uppercase tracking-wider text-gold sm:text-sm">
                {t("usColumn")}
              </span>
            </div>
          </div>

          {rowKeys.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="grid grid-cols-[1fr_1.4fr_1.4fr] border-t border-white/10 text-xs sm:grid-cols-[1.2fr_1.4fr_1.4fr] sm:text-sm"
            >
              <div className="flex items-center px-3 py-4 font-medium sm:px-4">
                {t(`rows.${key}.label`)}
              </div>
              <div className="flex items-start gap-2 border-s border-white/10 px-3 py-4 sm:items-center sm:px-4">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive/70 sm:mt-0" />
                <span className="text-muted-foreground">{t(`rows.${key}.them`)}</span>
              </div>
              <div className="relative flex items-start gap-2 border-s border-white/10 bg-gold/[0.03] px-3 py-4 sm:items-center sm:px-4">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold sm:mt-0" strokeWidth={2.5} />
                <span className="font-medium text-foreground">{t(`rows.${key}.us`)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
