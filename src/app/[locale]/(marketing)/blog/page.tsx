import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/marketing/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { BlogSearchForm } from "@/components/blog/blog-search-form";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { Link } from "@/i18n/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts, getAllCategories, getAllTags } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/blog",
    locale,
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { q, page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const page = Math.max(1, Number(pageParam) || 1);
  const [{ posts, totalPages }, categories, tags] = await Promise.all([
    getPublishedPosts({ query: q, page }),
    getAllCategories(),
    getAllTags(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/blog` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
            <div>
              <div className="lg:hidden">
                <BlogSearchForm
                  action="/blog"
                  defaultValue={q}
                  placeholder={t("searchPlaceholder")}
                />
              </div>

              {posts.length === 0 ? (
                <p className="mt-10 text-center text-muted-foreground">
                  {t("noResults")}
                </p>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-0">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}

              <BlogPagination
                basePath="/blog"
                currentPage={page}
                totalPages={totalPages}
                searchParams={{ q }}
              />
            </div>

            <aside className="space-y-8">
              <div className="hidden lg:block">
                <BlogSearchForm
                  action="/blog"
                  defaultValue={q}
                  placeholder={t("searchPlaceholder")}
                />
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("categoryLabel")}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link key={category.id} href={`/blog/category/${category.slug}`}>
                      <Badge variant="outline">
                        {category.name} ({category._count.posts})
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("tagLabel")}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                      <Badge variant="outline">#{tag.name}</Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
