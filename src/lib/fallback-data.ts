import { ContentStatus } from "@prisma/client";
import type {
  FAQ,
  Testimonial,
  Channel,
  Device,
  StatusIncident,
  Author,
  BlogCategory,
  BlogTag,
} from "@prisma/client";
import type { BlogPostWithRelations } from "@/lib/blog";
import {
  fullFaqs,
  moreTestimonials,
  statusIncidents,
  channels,
  devices,
  blogAuthors,
  blogPosts,
} from "../../prisma/seed-data";

/**
 * Static content used whenever DATABASE_URL isn't configured (builds without
 * a provisioned database, or a database outage at runtime). Sourced from the
 * same seed data used to populate a real database, so the fallback site
 * looks identical to a freshly-seeded one.
 */

function wordsPerMinute(html: string) {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export const FALLBACK_FAQS: FAQ[] = fullFaqs.map((faq, index) => ({
  id: `fallback-faq-${index}`,
  question: faq.question,
  answer: faq.answer,
  category: faq.category,
  locale: "en",
  sortOrder: index,
}));

export const FALLBACK_TESTIMONIALS: Testimonial[] = moreTestimonials.map((testimonial, index) => ({
  id: `fallback-testimonial-${index}`,
  name: testimonial.name,
  role: testimonial.role,
  avatar: null,
  rating: testimonial.rating,
  content: testimonial.content,
  locale: "en",
  isFeatured: true,
  createdAt: new Date(Date.UTC(2026, 0, 1 + index)),
}));

export const FALLBACK_CHANNELS: Channel[] = channels.map((channel, index) => ({
  id: `fallback-channel-${index}`,
  name: channel.name,
  category: channel.category,
  quality: channel.quality,
  region: channel.region,
  channelCount: channel.channelCount,
  sortOrder: index,
}));

export const FALLBACK_DEVICES: Device[] = devices.map((device) => ({
  id: `fallback-device-${device.platform}`,
  name: device.name,
  platform: device.platform,
  icon: device.icon,
  downloadUrl: device.downloadUrl,
  instructions: device.instructions,
  sortOrder: device.sortOrder,
}));

export const FALLBACK_STATUS_INCIDENTS: StatusIncident[] = statusIncidents.map((incident, index) => ({
  id: `fallback-incident-${index}`,
  title: incident.title,
  description: incident.description,
  status: incident.status,
  severity: incident.severity,
  startedAt: incident.startedAt,
  resolvedAt: incident.resolvedAt,
}));

// ---------- Blog ----------

export const FALLBACK_BLOG_AUTHORS: Author[] = blogAuthors.map((author) => ({
  id: `fallback-author-${author.slug}`,
  slug: author.slug,
  userId: null,
  name: author.name,
  avatar: null,
  bio: author.bio,
  socialLinks: author.socialLinks,
}));

const categoryMap = new Map<string, BlogCategory>();
const tagMap = new Map<string, BlogTag>();

for (const post of blogPosts) {
  if (!categoryMap.has(post.categorySlug)) {
    categoryMap.set(post.categorySlug, {
      id: `fallback-category-${post.categorySlug}`,
      slug: post.categorySlug,
      name: post.categoryName,
      locale: "en",
    });
  }
  for (const tagName of post.tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-");
    if (!tagMap.has(slug)) {
      tagMap.set(slug, { id: `fallback-tag-${slug}`, slug, name: tagName });
    }
  }
}

export const FALLBACK_BLOG_CATEGORIES: BlogCategory[] = Array.from(categoryMap.values());
export const FALLBACK_BLOG_TAGS: BlogTag[] = Array.from(tagMap.values());

const authorBySlug = new Map(FALLBACK_BLOG_AUTHORS.map((author) => [author.slug, author]));
const nowMs = Date.now();

export const FALLBACK_BLOG_POSTS: BlogPostWithRelations[] = blogPosts.map((post) => {
  const author = authorBySlug.get(post.authorSlug)!;
  const category = categoryMap.get(post.categorySlug)!;
  const publishedAt = new Date(nowMs - post.publishedDaysAgo * 24 * 60 * 60 * 1000);
  const postId = `fallback-post-${post.slug}`;

  return {
    id: postId,
    slug: post.slug,
    locale: "en",
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: null,
    authorId: author.id,
    categoryId: category.id,
    status: ContentStatus.PUBLISHED,
    publishedAt,
    readingTimeMins: wordsPerMinute(post.content),
    seoTitle: post.title,
    seoDescription: post.excerpt,
    ogImage: null,
    createdAt: publishedAt,
    updatedAt: publishedAt,
    author,
    category,
    tags: post.tags.map((tagName) => {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");
      const tag = tagMap.get(slug)!;
      return { postId, tagId: tag.id, tag };
    }),
  };
});
