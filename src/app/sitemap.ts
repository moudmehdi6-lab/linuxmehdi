import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { knowledgeBaseArticles } from "@/lib/knowledge-base-content";

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

  const [posts, categories, tags, authors] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogCategory.findMany({ select: { slug: true } }),
    prisma.blogTag.findMany({ select: { slug: true } }),
    prisma.author.findMany({ select: { slug: true } }),
  ]);

  for (const post of posts) {
    entries.push(...pathEntries(`/blog/${post.slug}`, post.updatedAt));
  }
  for (const category of categories) {
    entries.push(...pathEntries(`/blog/category/${category.slug}`, now));
  }
  for (const tag of tags) {
    entries.push(...pathEntries(`/blog/tag/${tag.slug}`, now));
  }
  for (const author of authors) {
    entries.push(...pathEntries(`/blog/author/${author.slug}`, now));
  }

  return entries;
}
