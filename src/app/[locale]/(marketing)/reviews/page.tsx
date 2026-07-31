import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import { FALLBACK_TESTIMONIALS } from "@/lib/fallback-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "reviewsPage" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/reviews",
    locale,
  });
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "reviewsPage" });
  const reviews = await safeQuery(
    () => prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } }),
    FALLBACK_TESTIMONIALS,
  );

  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/reviews` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-12 lg:pb-16">
        <Container className="max-w-2xl">
          <div className="glass flex flex-col gap-8 rounded-2xl p-8 sm:flex-row sm:items-center">
            <div className="text-center sm:w-40 sm:shrink-0">
              <div className="font-display text-5xl font-bold">{average.toFixed(1)}</div>
              <div className="mt-2 flex justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(average)
                        ? "h-4 w-4 fill-gold text-gold"
                        : "h-4 w-4 text-white/15"
                    }
                  />
                ))}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t("basedOn", { count: total })}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {distribution.map(({ stars, count }) => (
                <div key={stars} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-muted-foreground">{stars}</span>
                  <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <TestimonialCard key={review.id} testimonial={review} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
