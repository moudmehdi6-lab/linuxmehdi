import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { knowledgeBaseArticles } from "@/lib/knowledge-base-content";
import {
  getAllPublishedPostsMeta,
  getAllCategorySlugs,
  getAllTagSlugs,
  getAllAuthorSlugs,
} from "@/lib/blog";

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

function pathEntries(path: string, lastModified: Date): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]),
      ),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const path of staticPaths) {
    entries.push(...pathEntries(path, now));
  }

  for (const article of knowledgeBaseArticles) {
    entries.push(...pathEntries(`/knowledge-base/${article.slug}`, now));
  }

  const [posts, categorySlugs, tagSlugs, authorSlugs] = await Promise.all([
    getAllPublishedPostsMeta(),
    getAllCategorySlugs(),
    getAllTagSlugs(),
    getAllAuthorSlugs(),
  ]);

  for (const post of posts) {
    entries.push(...pathEntries(`/blog/${post.slug}`, post.updatedAt));
  }
  for (const slug of categorySlugs) {
    entries.push(...pathEntries(`/blog/category/${slug}`, now));
  }
  for (const slug of tagSlugs) {
    entries.push(...pathEntries(`/blog/tag/${slug}`, now));
  }
  for (const slug of authorSlugs) {
    entries.push(...pathEntries(`/blog/author/${slug}`, now));
  }

  return entries;
}
