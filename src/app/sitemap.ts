import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

const staticPaths = [
  "",
  "/pricing",
  "/features",
  "/channels",
  "/devices",
  "/downloads",
  "/how-it-works",
  "/faq",
  "/testimonials",
  "/reviews",
  "/about",
  "/contact",
  "/affiliate-program",
  "/reseller-program",
  "/knowledge-base",
  "/blog",
  "/privacy-policy",
  "/terms",
  "/refund-policy",
  "/cookie-policy",
  "/status",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteConfig.url}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
          ),
        },
      });
    }
  }

  return entries;
}
