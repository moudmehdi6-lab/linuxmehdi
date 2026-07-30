"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const stats = [
  { key: "statUptime", value: "99.9%" },
  { key: "statChannels", value: "20,000+" },
  { key: "statCountries", value: "150+" },
  { key: "statSupport", value: "24/7" },
] as const;

export function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28">
      <AuroraBackground />
      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="default">{t("eyebrow")}</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-balance font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-balance text-lg text-muted-foreground md:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg">
              <Link href="/pricing">{t("ctaPrimary")}</Link>
            </Button>
            <WhatsAppCTAButton
              href={buildGeneralWhatsAppLink(locale)}
              label={t("ctaSecondary")}
              size="lg"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl px-8 py-8 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.key} className="text-center">
              <div className="text-gradient-gold font-display text-2xl font-bold sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {t(stat.key)}
              </div>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
