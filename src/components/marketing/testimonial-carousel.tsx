"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/fallback-data";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const t = useTranslations("home.testimonials");
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(
    () => setIndex((i) => (i + 1) % testimonials.length),
    [testimonials.length],
  );
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  React.useEffect(() => {
    if (paused || testimonials.length <= 1) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[index]!;
  const initials = current.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="py-10 sm:py-16 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Badge>{t("eyebrow")}</Badge>
          <h2 className="mt-6 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
        </div>

        <div
          className="relative mx-auto mt-10 max-w-2xl sm:mt-12 lg:mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="glass relative overflow-hidden rounded-3xl px-6 py-8 sm:px-14 sm:py-12">
            <Quote className="mx-auto h-8 w-8 text-gold/40" />
            <div className="relative mt-4 min-h-52">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="mt-5 text-balance text-lg leading-relaxed text-foreground/90">
                    &ldquo;{current.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-electric text-xs font-semibold text-obsidian">
                      {initials}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{current.name}</div>
                      {current.role && (
                        <div className="text-sm text-muted-foreground">{current.role}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous testimonial"
              onClick={prev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-gold" : "w-1.5 bg-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Button variant="outline" size="icon" aria-label="Next testimonial" onClick={next}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
