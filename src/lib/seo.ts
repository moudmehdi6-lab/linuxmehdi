import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  image?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path,
  locale = "en",
  image,
  noIndex = false,
}: BuildMetadataArgs): Metadata {
  const url = `${siteConfig.url}/${locale}${path}`;
  const ogImage = image ?? `${siteConfig.url}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${path}`,
        fr: `${siteConfig.url}/fr${path}`,
        de: `${siteConfig.url}/de${path}`,
        es: `${siteConfig.url}/es${path}`,
        ar: `${siteConfig.url}/ar${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
