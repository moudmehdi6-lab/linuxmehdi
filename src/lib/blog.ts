import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/db";
import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_BLOG_CATEGORIES,
  FALLBACK_BLOG_TAGS,
  FALLBACK_BLOG_AUTHORS,
} from "@/lib/fallback-data";

export const POSTS_PER_PAGE = 9;

export const blogPostInclude = {
  author: true,
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.BlogPostInclude;

export type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: typeof blogPostInclude;
}>;

function filterFallbackPosts(
  posts: BlogPostWithRelations[],
  {
    query,
    categorySlug,
    tagSlug,
    authorSlug,
    excludeId,
  }: {
    query?: string;
    categorySlug?: string;
    tagSlug?: string;
    authorSlug?: string;
    excludeId?: string;
  },
) {
  const q = query?.trim().toLowerCase();
  return posts
    .filter((post) => {
      if (excludeId && post.id === excludeId) return false;
      if (categorySlug && post.category.slug !== categorySlug) return false;
      if (authorSlug && post.author.slug !== authorSlug) return false;
      if (tagSlug && !post.tags.some((t) => t.tag.slug === tagSlug)) return false;
      if (
        q &&
        !post.title.toLowerCase().includes(q) &&
        !post.excerpt.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
}

export async function getPublishedPosts({
  query,
  categorySlug,
  tagSlug,
  authorSlug,
  page = 1,
  perPage = POSTS_PER_PAGE,
}: {
  query?: string;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  page?: number;
  perPage?: number;
} = {}) {
  const fallbackFiltered = filterFallbackPosts(FALLBACK_BLOG_POSTS, {
    query,
    categorySlug,
    tagSlug,
    authorSlug,
  });
  const fallbackTotal = fallbackFiltered.length;
  const fallback = {
    posts: fallbackFiltered.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
    total: fallbackTotal,
    totalPages: Math.max(1, Math.ceil(fallbackTotal / perPage)),
  };

  return safeQuery(async () => {
    const where: Prisma.BlogPostWhereInput = {
      status: ContentStatus.PUBLISHED,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(tagSlug ? { tags: { some: { tag: { slug: tagSlug } } } } : {}),
      ...(authorSlug ? { author: { slug: authorSlug } } : {}),
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: blogPostInclude,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { posts, total, totalPages: Math.max(1, Math.ceil(total / perPage)) };
  }, fallback);
}

export async function getPostBySlug(slug: string) {
  const fallback = FALLBACK_BLOG_POSTS.find((post) => post.slug === slug) ?? null;

  return safeQuery(
    () =>
      prisma.blogPost.findFirst({
        where: { slug, status: ContentStatus.PUBLISHED },
        include: blogPostInclude,
      }),
    fallback,
  );
}

export async function getRelatedPosts(post: BlogPostWithRelations, limit = 3) {
  const fallback = filterFallbackPosts(FALLBACK_BLOG_POSTS, {
    categorySlug: post.category.slug,
    excludeId: post.id,
  }).slice(0, limit);

  return safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          categoryId: post.categoryId,
          id: { not: post.id },
        },
        include: blogPostInclude,
        orderBy: { publishedAt: "desc" },
        take: limit,
      }),
    fallback,
  );
}

export async function getAllCategories() {
  const fallback = FALLBACK_BLOG_CATEGORIES.map((category) => ({
    ...category,
    _count: {
      posts: FALLBACK_BLOG_POSTS.filter((post) => post.categoryId === category.id).length,
    },
  })).sort((a, b) => a.name.localeCompare(b.name));

  return safeQuery(
    () =>
      prisma.blogCategory.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
      }),
    fallback,
  );
}

export async function getAllTags() {
  const fallback = FALLBACK_BLOG_TAGS.map((tag) => ({
    ...tag,
    _count: {
      posts: FALLBACK_BLOG_POSTS.filter((post) => post.tags.some((t) => t.tagId === tag.id))
        .length,
    },
  })).sort((a, b) => a.name.localeCompare(b.name));

  return safeQuery(
    () =>
      prisma.blogTag.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { posts: true } } },
      }),
    fallback,
  );
}

export async function getCategoryBySlug(slug: string) {
  const fallback = FALLBACK_BLOG_CATEGORIES.find((category) => category.slug === slug) ?? null;
  return safeQuery(() => prisma.blogCategory.findUnique({ where: { slug } }), fallback);
}

export async function getTagBySlug(slug: string) {
  const fallback = FALLBACK_BLOG_TAGS.find((tag) => tag.slug === slug) ?? null;
  return safeQuery(() => prisma.blogTag.findUnique({ where: { slug } }), fallback);
}

export async function getAuthorBySlug(slug: string) {
  const fallback = FALLBACK_BLOG_AUTHORS.find((author) => author.slug === slug) ?? null;
  return safeQuery(() => prisma.author.findUnique({ where: { slug } }), fallback);
}

export async function getAllPublishedSlugs() {
  const fallback = FALLBACK_BLOG_POSTS.map((post) => post.slug);
  return safeQuery(
    () =>
      prisma.blogPost
        .findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true } })
        .then((rows) => rows.map((row) => row.slug)),
    fallback,
  );
}

export async function getAllPublishedPostsMeta() {
  const fallback = FALLBACK_BLOG_POSTS.map((post) => ({
    slug: post.slug,
    updatedAt: post.updatedAt,
  }));
  return safeQuery(
    () =>
      prisma.blogPost.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
    fallback,
  );
}

export async function getAllCategorySlugs() {
  const fallback = FALLBACK_BLOG_CATEGORIES.map((category) => category.slug);
  return safeQuery(
    () => prisma.blogCategory.findMany({ select: { slug: true } }).then((rows) => rows.map((row) => row.slug)),
    fallback,
  );
}

export async function getAllTagSlugs() {
  const fallback = FALLBACK_BLOG_TAGS.map((tag) => tag.slug);
  return safeQuery(
    () => prisma.blogTag.findMany({ select: { slug: true } }).then((rows) => rows.map((row) => row.slug)),
    fallback,
  );
}

export async function getAllAuthorSlugs() {
  const fallback = FALLBACK_BLOG_AUTHORS.map((author) => author.slug);
  return safeQuery(
    () => prisma.author.findMany({ select: { slug: true } }).then((rows) => rows.map((row) => row.slug)),
    fallback,
  );
}

export type TocHeading = { id: string; text: string; level: 2 | 3 };

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Injects id="..." into h2/h3 tags and returns both the modified HTML and a TOC list. */
export function extractHeadingsAndAnnotate(html: string): {
  html: string;
  headings: TocHeading[];
} {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();

  const annotated = html.replace(
    /<(h2|h3)>(.*?)<\/\1>/g,
    (_match, tag: "h2" | "h3", inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      let id = slugifyHeading(text);
      const count = seen.get(id) ?? 0;
      seen.set(id, count + 1);
      if (count > 0) id = `${id}-${count}`;
      headings.push({ id, text, level: tag === "h2" ? 2 : 3 });
      return `<${tag} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: annotated, headings };
}
