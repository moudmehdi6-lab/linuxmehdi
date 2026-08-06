import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/marketing/page-hero";
import { PostCard } from "@/components/blog/post-card";
import { BlogPagination } from "@/components/blog/blog-pagination";
import { Link } from "@/i18n/navigation";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { getPublishedPosts, getAllCategories, getCategoryBySlug, getAllCategorySlugs } from "@/lib/blog";
import { getCategoryContent } from "@/lib/category-content";

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return {};

  const curated = getCategoryContent(categorySlug);
  const description = curated
    ? curated.description.slice(0, 160).replace(/\s+\S*$/, "") + "…"
    : `Articles about ${category.name} from the IPTVLinux blog.`;

  return buildMetadata({
    title: `${category.name} Guides & Articles`,
    description,
    path: `/blog/category/${categorySlug}`,
    locale,
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  const { page: pageParam } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const curated = getCategoryContent(categorySlug);
  const page = Math.max(1, Number(pageParam) || 1);
  const [{ posts, totalPages }, categories] = await Promise.all([
    getPublishedPosts({ categorySlug, page }),
    getAllCategories(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/blog` },
          { name: category.name, url: `${siteConfig.url}/${locale}/blog/category/${categorySlug}` },
        ]}
      />
      {curated && curated.faqs.length > 0 && <FaqJsonLd items={curated.faqs} />}
      <PageHero
        eyebrow={t("categoryLabel")}
        title={category.name}
        subtitle={curated ? undefined : `${t("title")} — ${category.name}`}
      />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          {curated && (
            <div className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
              <p>{curated.description}</p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/blog/category/${c.slug}`}
                className={
                  c.slug === categorySlug
                    ? "rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-obsidian"
                    : "rounded-full border border-white/15 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                }
              >
                {c.name}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="mt-10 text-center text-muted-foreground">{t("noResults")}</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <BlogPagination
            basePath={`/blog/category/${categorySlug}`}
            currentPage={page}
            totalPages={totalPages}
          />

          {curated && curated.faqs.length > 0 && (
            <div className="mx-auto mt-16 max-w-2xl">
              <h2 className="font-display text-2xl font-semibold">{t("faqTitle")}</h2>
              <Accordion type="single" collapsible className="mt-4">
                {curated.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`category-faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
