import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/hero";
import { ChannelCategoriesSection } from "@/components/marketing/channel-categories-section";
import { PricingPreviewSection } from "@/components/marketing/pricing-preview-section";
import { FaqPreviewSection } from "@/components/marketing/faq-preview-section";
import { BlogPreviewSection } from "@/components/marketing/blog-preview-section";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

// Below-the-fold, animation-heavy client sections: code-split into their
// own chunks so the initial hydration bundle only carries the Hero's JS.
const BentoFeatureGrid = dynamic(() =>
  import("@/components/marketing/bento-feature-grid").then((m) => m.BentoFeatureGrid),
);
const DeviceCompatGrid = dynamic(() =>
  import("@/components/marketing/device-compat-grid").then((m) => m.DeviceCompatGrid),
);
const WhyChooseSection = dynamic(() =>
  import("@/components/marketing/why-choose-section").then((m) => m.WhyChooseSection),
);
const TestimonialCarousel = dynamic(() =>
  import("@/components/marketing/testimonial-carousel").then((m) => m.TestimonialCarousel),
);
const NewsletterSection = dynamic(() =>
  import("@/components/marketing/newsletter-section").then((m) => m.NewsletterSection),
);
const CTASection = dynamic(() =>
  import("@/components/marketing/cta-section").then((m) => m.CTASection),
);
import { buildMetadata } from "@/lib/seo";
import { FALLBACK_TESTIMONIALS } from "@/lib/fallback-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.hero" });

  return buildMetadata({
    title: `${t("title")}`,
    description: t("subtitle"),
    path: "/",
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allTestimonials = FALLBACK_TESTIMONIALS;
  const featuredTestimonials = allTestimonials
    .filter((testimonial) => testimonial.isFeatured)
    .slice(0, 6);

  const reviewCount = allTestimonials.length;
  const averageRating =
    reviewCount > 0
      ? allTestimonials.reduce((sum, item) => sum + item.rating, 0) / reviewCount
      : 5;
  const avatarInitials = allTestimonials.slice(0, 5).map((item) =>
    item.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  );

  return (
    <>
      <OrganizationJsonLd />
      <Hero
        rating={{ average: averageRating, count: reviewCount, avatars: avatarInitials }}
      />
      <BentoFeatureGrid />
      <DeviceCompatGrid />
      <ChannelCategoriesSection />
      <WhyChooseSection />
      <TestimonialCarousel testimonials={featuredTestimonials} />
      <PricingPreviewSection />
      <FaqPreviewSection />
      <BlogPreviewSection />
      <NewsletterSection />
      <CTASection />
    </>
  );
}
