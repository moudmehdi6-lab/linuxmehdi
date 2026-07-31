import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const POSTS_PER_PAGE = 9;

export const blogPostInclude = {
  author: true,
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.BlogPostInclude;

export type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: typeof blogPostInclude;
}>;

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
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED },
    include: blogPostInclude,
  });
}

export async function getRelatedPosts(post: BlogPostWithRelations, limit = 3) {
  return prisma.blogPost.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      categoryId: post.categoryId,
      id: { not: post.id },
    },
    include: blogPostInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getAllCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getAllTags() {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
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
