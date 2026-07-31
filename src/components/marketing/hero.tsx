"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, ShieldCheck, Clock, Sparkles, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { HeroIllustration } from "@/components/marketing/hero-illustration";

// Purely decorative, hidden below the lg breakpoint, and not part of the
// LCP text — deferred out of the initial hydration bundle so it never
// competes with the critical hero copy for main-thread time.
const FloatingElements = dynamic(
  () => import("@/components/marketing/floating-elements").then((m) => m.FloatingElements),
  { ssr: false },
);
import { AnimatedCounter } from "@/components/marketing/animated-counter";
import { WhatsAppCTAButton } from "@/components/whatsapp/whatsapp-cta-button";
import { buildGeneralWhatsAppLink } from "@/lib/whatsapp";

const stats: {
  key: string;
  value: number | null;
  decimals: number;
  suffix: string;
  display: string;
}[] = [
  { key: "statUptime", value: 99.9, decimals: 1, suffix: "%", display: "" },
  { key: "statChannels", value: 20000, decimals: 0, suffix: "+", display: "" },
  { key: "statCountries", value: 150, decimals: 0, suffix: "+", display: "" },
  { key: "statSupport", value: null, decimals: 0, suffix: "", display: "24/7" },
];

const trustItems = [
  { key: "trustSecure", icon: ShieldCheck },
  { key: "trustSetup", icon: Clock },
  { key: "trustQuality", icon: Sparkles },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

type HeroProps = {
  rating?: {
    average: number;
    count: number;
    avatars: string[];
  };
};

export function Hero({ rating }: HeroProps) {
  const t = useTranslations("home.hero");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-24">
      <AuroraBackground variant="hero" />
      <HeroIllustration />
      <FloatingElements />

      <Container className="relative">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
            <Badge className="gap-1.5 border-gold/20 bg-gold/[0.08] py-1.5 pl-2 pr-3 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              {t("eyebrow")}
            </Badge>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={0.08}
            variants={fadeUp}
            className="mt-7 text-balance font-display text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-6xl md:text-[4.25rem]"
          >
            <span className="bg-gradient-to-br from-obsidian via-obsidian to-obsidian/70 bg-clip-text text-transparent dark:from-white dark:via-white dark:to-white/60">
              {t("title")}
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={0.16}
            variants={fadeUp}
            className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={0.24}
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="group h-14 px-8 text-base shadow-[0_0_40px_-8px_rgba(212,175,55,0.55)]"
            >
              <Link href="/pricing">
                {t("ctaPrimary")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <WhatsAppCTAButton
              href={buildGeneralWhatsAppLink(locale)}
              label={t("ctaSecondary")}
              size="lg"
              className="h-14 px-8 text-base"
            />
          </motion.div>

          {rating && rating.count > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              custom={0.3}
              variants={fadeUp}
              className="mt-8 flex flex-col items-center gap-2.5 sm:flex-row sm:gap-4"
            >
              <div className="flex -space-x-2.5">
                {rating.avatars.map((initials, index) => (
                  <div
                    key={`${initials}-${index}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-gold to-electric text-[11px] font-semibold text-obsidian"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-0.5 sm:items-start">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(rating.average)
                          ? "h-3.5 w-3.5 fill-gold text-gold"
                          : "h-3.5 w-3.5 text-white/15"
                      }
                    />
                  ))}
                  <span className="ms-1 text-sm font-semibold">
                    {rating.average.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("ratingBasedOn", { count: rating.count })}
                </span>
              </div>
            </motion.div>
          )}

          <motion.div
            initial="hidden"
            animate="show"
            custom={0.38}
            variants={fadeUp}
            className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
          >
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.key}
                  className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground/80 sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-gold" />
                  {t(item.key)}
                </span>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.46, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 overflow-hidden rounded-3xl px-6 py-8 sm:mt-14 sm:px-8 sm:py-10 sm:grid-cols-4"
        >
          <div className="bg-gradient-shine absolute inset-0 -z-10 animate-gradient-x bg-[length:200%_100%] opacity-40" />
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.08 }}
              className="text-center"
            >
              <div className="text-gradient-gold font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {stat.value === null ? (
                  stat.display
                ) : (
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                )}
              </div>
              <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm">
                {t(stat.key)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
