import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CalendarDays, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { RelatedPosts } from "@/components/blog/related-posts";
import { PopularArticles } from "@/components/blog/popular-articles";
import { PostNavigation } from "@/components/blog/post-navigation";
import { HeadingAnchors } from "@/components/blog/heading-anchors";
import { CTASection } from "@/components/marketing/cta-section";
import { Link } from "@/i18n/navigation";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  getPostBySlug,
  getRelatedPosts,
  getPopularPosts,
  getAdjacentPosts,
  extractHeadingsAndAnnotate,
  getAllPublishedSlugs,
} from "@/lib/blog";

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${slug}`,
    locale,
    image: post.ogImage ?? undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, popular, { previous, next }] = await Promise.all([
    getRelatedPosts(post),
    getPopularPosts(),
    getAdjacentPosts(post),
  ]);
  const { html, headings } = extractHeadingsAndAnnotate(post.content);
  const publishedAt = post.publishedAt ?? post.createdAt;
  const wasUpdated = post.updatedAt.getTime() !== publishedAt.getTime();
  const postUrl = `${siteConfig.url}/${locale}/blog/${slug}`;
  const articleContentId = `article-content-${post.id}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={postUrl}
        image={post.ogImage ?? undefined}
        datePublished={publishedAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        authorName={post.author.name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      {post.faqs.length > 0 && <FaqJsonLd items={post.faqs} />}

      <article className="py-10 sm:py-12 lg:py-16">
        <Container className="max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: t("title"), href: "/blog" },
              { label: post.title },
            ]}
          />

          <Badge variant="electric" className="mt-6">
            <Link href={`/blog/category/${post.category.slug}`}>{post.category.name}</Link>
          </Badge>

          <h1 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link
              href={`/blog/author/${post.author.slug}`}
              className="focus-ring font-medium text-foreground hover:text-gold"
            >
              {t("byAuthor", { name: post.author.name })}
            </Link>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {publishedAt.toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {t("minRead", { minutes: post.readingTimeMins })}
            </span>
            {wasUpdated && (
              <span className="flex items-center gap-1.5">
                {t("updatedOn", {
                  date: post.updatedAt.toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                })}
              </span>
            )}
          </div>

          <div className="mt-8 lg:hidden">
            <TableOfContents headings={headings} />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_240px]">
            <div
              id={articleContentId}
              className="prose prose-invert prose-headings:font-display prose-headings:font-semibold prose-headings:scroll-mt-24 prose-a:text-gold max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <HeadingAnchors containerId={articleContentId} />
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <TableOfContents headings={headings} />
                <PopularArticles posts={popular} />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map(({ tag }) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <Badge variant="outline">#{tag.name}</Badge>
              </Link>
            ))}
          </div>

          {post.faqs.length > 0 && (
            <div className="mt-10 sm:mt-12">
              <h2 className="font-display text-2xl font-semibold">
                {t("faqTitle")}
              </h2>
              <Accordion type="single" collapsible className="mt-4">
                {post.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`${post.id}-faq-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          <Separator className="my-10" />

          <div className="glass flex items-center gap-4 rounded-2xl p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-electric text-sm font-semibold text-obsidian">
              {post.author.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <Link href={`/blog/author/${post.author.slug}`} className="font-medium hover:text-gold">
                {post.author.name}
              </Link>
              {post.author.bio && (
                <p className="mt-1 text-sm text-muted-foreground">{post.author.bio}</p>
              )}
            </div>
          </div>

          <div className="mt-10 sm:mt-12">
            <PostNavigation previous={previous} next={next} />
          </div>

          {related.length > 0 && (
            <div className="mt-10 sm:mt-12 lg:mt-16">
              <RelatedPosts posts={related} />
            </div>
          )}
        </Container>
      </article>

      <CTASection />
    </>
  );
}
