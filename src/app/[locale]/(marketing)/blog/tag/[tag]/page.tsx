import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/marketing/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { getPublishedPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const tags = await prisma.blogTag.findMany({ select: { slug: true } });
  return tags.map((tag) => ({ tag: tag.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag: tagSlug } = await params;
  const tag = await prisma.blogTag.findUnique({ where: { slug: tagSlug } });
  if (!tag) return {};

  return buildMetadata({
    title: `#${tag.name}`,
    description: `Articles tagged #${tag.name} on the IPTVLinux blog.`,
    path: `/blog/tag/${tagSlug}`,
    locale,
  });
}

export default async function BlogTagPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, tag: tagSlug } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const tag = await prisma.blogTag.findUnique({ where: { slug: tagSlug } });
  if (!tag) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPublishedPosts({ tagSlug, page });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/blog` },
          { name: `#${tag.name}`, url: `${siteConfig.url}/${locale}/blog/tag/${tagSlug}` },
        ]}
      />
      <PageHero eyebrow={t("tagLabel")} title={`#${tag.name}`} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          {posts.length === 0 ? (
            <p className="mt-4 text-center text-muted-foreground">{t("noResults")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <BlogPagination
            basePath={`/blog/tag/${tagSlug}`}
            currentPage={page}
            totalPages={totalPages}
          />
        </Container>
      </section>
    </>
  );
}
