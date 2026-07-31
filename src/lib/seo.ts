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
  // Normalize so the homepage ("/") never produces a trailing-slash URL
  // like ".../en/" that mismatches the non-trailing-slash hreflang alternates.
  const normalizedPath = path === "/" ? "" : path;
  const url = `${siteConfig.url}/${locale}${normalizedPath}`;
  const ogImage = image ?? `${siteConfig.url}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteConfig.url}/en${normalizedPath}`,
        fr: `${siteConfig.url}/fr${normalizedPath}`,
        de: `${siteConfig.url}/de${normalizedPath}`,
        es: `${siteConfig.url}/es${normalizedPath}`,
        ar: `${siteConfig.url}/ar${normalizedPath}`,
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
