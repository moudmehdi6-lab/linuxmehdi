import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/hero";
import { BentoFeatureGrid } from "@/components/marketing/bento-feature-grid";
import { DeviceCompatGrid } from "@/components/marketing/device-compat-grid";
import { PricingPreviewSection } from "@/components/marketing/pricing-preview-section";
import { TestimonialCarousel } from "@/components/marketing/testimonial-carousel";
import { CTASection } from "@/components/marketing/cta-section";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";

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

  return (
    <>
      <OrganizationJsonLd />
      <Hero />
      <BentoFeatureGrid />
      <DeviceCompatGrid />
      <PricingPreviewSection />
      <TestimonialCarousel />
      <CTASection />
    </>
  );
}
