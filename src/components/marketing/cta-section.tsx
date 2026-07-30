"use client";

import { useTranslations, useLocale } from "next-intl";
import { Container } from "@/components/ui/container";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

export function CTASection() {
  const t = useTranslations("home.cta");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden py-24">
      <AuroraBackground />
      <Container>
        <div className="glass mx-auto max-w-3xl rounded-3xl px-8 py-16 text-center">
          <h2 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex justify-center">
            <WhatsAppCTAButton
              href={buildGeneralWhatsAppLink(locale)}
              label={t("button")}
              size="lg"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
