"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function CTASection() {
  const t = useTranslations("home.cta");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden py-10 sm:py-16 lg:py-24">
      <AuroraBackground variant="hero" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-3xl rounded-[2rem] bg-gradient-to-b from-gold/30 via-white/10 to-transparent p-[1px] shadow-[0_40px_100px_-40px_rgba(212,175,55,0.4)]"
        >
          <div className="glass rounded-[2rem] px-6 py-10 text-center sm:px-16 sm:py-16">
            <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {t("title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-balance text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:mt-9 sm:flex-row">
              <WhatsAppCTAButton
                href={buildGeneralWhatsAppLink(locale)}
                label={t("button")}
                size="lg"
                className="h-14 px-8 text-base"
              />
              <Link
                href="/pricing"
                className="focus-ring text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-gold hover:underline"
              >
                {t("secondaryLink")}
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
