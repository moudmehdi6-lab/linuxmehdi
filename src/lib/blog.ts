import {
  FALLBACK_BLOG_POSTS,
  FALLBACK_BLOG_CATEGORIES,
  FALLBACK_BLOG_TAGS,
  FALLBACK_BLOG_AUTHORS,
  type BlogPostWithRelations,
} from "@/lib/fallback-data";

/**
 * Blog data layer for the public site. Reads purely from static fallback
 * data — no database, no network call, nothing that can fail a build.
 */

export type { BlogPostWithRelations };

export const POSTS_PER_PAGE = 9;

function filterPosts(
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
  const filtered = filterPosts(FALLBACK_BLOG_POSTS, { query, categorySlug, tagSlug, authorSlug });
  const total = filtered.length;
  return {
    posts: filtered.slice((page - 1) * perPage, (page - 1) * perPage + perPage),
    total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
  };
}

export async function getPostBySlug(slug: string) {
  return FALLBACK_BLOG_POSTS.find((post) => post.slug === slug) ?? null;
}

export async function getRelatedPosts(post: BlogPostWithRelations, limit = 3) {
  return filterPosts(FALLBACK_BLOG_POSTS, {
    categorySlug: post.category.slug,
    excludeId: post.id,
  }).slice(0, limit);
}

export async function getAllCategories() {
  return FALLBACK_BLOG_CATEGORIES.map((category) => ({
    ...category,
    _count: {
      posts: FALLBACK_BLOG_POSTS.filter((post) => post.categoryId === category.id).length,
    },
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getAllTags() {
  return FALLBACK_BLOG_TAGS.map((tag) => ({
    ...tag,
    _count: {
      posts: FALLBACK_BLOG_POSTS.filter((post) => post.tags.some((t) => t.tagId === tag.id))
        .length,
    },
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCategoryBySlug(slug: string) {
  return FALLBACK_BLOG_CATEGORIES.find((category) => category.slug === slug) ?? null;
}

export async function getTagBySlug(slug: string) {
  return FALLBACK_BLOG_TAGS.find((tag) => tag.slug === slug) ?? null;
}

export async function getAuthorBySlug(slug: string) {
  return FALLBACK_BLOG_AUTHORS.find((author) => author.slug === slug) ?? null;
}

export async function getAllPublishedSlugs() {
  return FALLBACK_BLOG_POSTS.map((post) => post.slug);
}

export async function getAllPublishedPostsMeta() {
  return FALLBACK_BLOG_POSTS.map((post) => ({ slug: post.slug, updatedAt: post.updatedAt }));
}

export async function getAllCategorySlugs() {
  return FALLBACK_BLOG_CATEGORIES.map((category) => category.slug);
}

export async function getAllTagSlugs() {
  return FALLBACK_BLOG_TAGS.map((tag) => tag.slug);
}

export async function getAllAuthorSlugs() {
  return FALLBACK_BLOG_AUTHORS.map((author) => author.slug);
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
