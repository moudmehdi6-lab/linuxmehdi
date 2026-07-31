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
import { getPublishedPosts, getAuthorBySlug, getAllAuthorSlugs } from "@/lib/blog";

export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((author) => ({ author }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; author: string }>;
}): Promise<Metadata> {
  const { locale, author: authorSlug } = await params;
  const author = await getAuthorBySlug(authorSlug);
  if (!author) return {};

  return buildMetadata({
    title: author.name,
    description: author.bio ?? `Articles by ${author.name} on the IPTVLinux blog.`,
    path: `/blog/author/${authorSlug}`,
    locale,
  });
}

export default async function BlogAuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; author: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, author: authorSlug } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const author = await getAuthorBySlug(authorSlug);
  if (!author) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { posts, totalPages } = await getPublishedPosts({ authorSlug, page });

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/blog` },
          { name: author.name, url: `${siteConfig.url}/${locale}/blog/author/${authorSlug}` },
        ]}
      />
      <PageHero eyebrow={t("authorLabel")} title={author.name} subtitle={author.bio ?? undefined} />

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
            basePath={`/blog/author/${authorSlug}`}
            currentPage={page}
            totalPages={totalPages}
          />
        </Container>
      </section>
    </>
  );
}
