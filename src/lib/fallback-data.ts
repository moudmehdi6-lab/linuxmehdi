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
 * Static content for the public marketing site. This is the ONLY data
 * source for public pages — there is no database dependency here or
 * anywhere downstream of it, so the site builds and runs with zero
 * configuration. (The customer dashboard and admin panel are separate,
 * authenticated areas that still use Prisma/PostgreSQL.)
 */

// ---------- Local content types (no @prisma/client dependency) ----------

export type ChannelQuality = "SD" | "HD" | "FHD" | "UHD_4K";
export type IncidentStatus = "INVESTIGATING" | "IDENTIFIED" | "MONITORING" | "RESOLVED";
export type IncidentSeverity = "MINOR" | "MAJOR" | "CRITICAL";
export type ContentStatus = "DRAFT" | "PUBLISHED";

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
  locale: string;
  sortOrder: number;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string | null;
  avatar: string | null;
  rating: number;
  content: string;
  locale: string;
  isFeatured: boolean;
  createdAt: Date;
};

export type Channel = {
  id: string;
  name: string;
  category: string;
  quality: ChannelQuality;
  region: string;
  channelCount: number;
  sortOrder: number;
};

export type Device = {
  id: string;
  name: string;
  platform: string;
  icon: string;
  downloadUrl: string | null;
  instructions: string;
  sortOrder: number;
};

export type StatusIncident = {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  startedAt: Date;
  resolvedAt: Date | null;
};

export type Author = {
  id: string;
  slug: string;
  userId: string | null;
  name: string;
  avatar: string | null;
  bio: string | null;
  socialLinks: unknown;
};

export type BlogCategory = { id: string; slug: string; name: string; locale: string };
export type BlogTag = { id: string; slug: string; name: string };

export type BlogPostWithRelations = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  authorId: string;
  categoryId: string;
  status: ContentStatus;
  publishedAt: Date | null;
  readingTimeMins: number;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: Author;
  category: BlogCategory;
  tags: { postId: string; tagId: string; tag: BlogTag }[];
};

// ---------- Static data ----------

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

export const FALLBACK_TESTIMONIALS: Testimonial[] = moreTestimonials
  .map((testimonial, index) => ({
    id: `fallback-testimonial-${index}`,
    name: testimonial.name,
    role: testimonial.role,
    avatar: null,
    rating: testimonial.rating,
    content: testimonial.content,
    locale: "en",
    isFeatured: true,
    createdAt: new Date(Date.UTC(2026, 0, 1 + index)),
  }))
  .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

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

export const FALLBACK_STATUS_INCIDENTS: StatusIncident[] = statusIncidents
  .map((incident, index) => ({
    id: `fallback-incident-${index}`,
    title: incident.title,
    description: incident.description,
    status: incident.status,
    severity: incident.severity,
    startedAt: incident.startedAt,
    resolvedAt: incident.resolvedAt,
  }))
  .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

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
    status: "PUBLISHED",
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
