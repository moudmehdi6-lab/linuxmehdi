import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/blog/breadcrumbs";
import { Link } from "@/i18n/navigation";
import { BreadcrumbJsonLd, DefinedTermJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  glossaryTerms,
  getGlossaryTermBySlug,
  getRelatedGlossaryTerms,
} from "@/lib/glossary-content";

export function generateStaticParams() {
  return glossaryTerms.map((term) => ({ slug: term.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const term = getGlossaryTermBySlug(slug);
  if (!term) return {};

  return buildMetadata({
    title: `${term.term}: Definition & Explanation`,
    description: term.shortDefinition,
    path: `/blog/glossary/${slug}`,
    locale,
  });
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "glossary" });
  const blogT = await getTranslations({ locale, namespace: "blog" });
  const term = getGlossaryTermBySlug(slug);

  if (!term) notFound();

  const related = getRelatedGlossaryTerms(term);
  const termUrl = `${siteConfig.url}/${locale}/blog/glossary/${slug}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: blogT("title"), url: `${siteConfig.url}/${locale}/blog` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/blog/glossary` },
          { name: term.term, url: termUrl },
        ]}
      />
      <DefinedTermJsonLd
        name={term.term}
        description={term.shortDefinition}
        url={termUrl}
        inDefinedTermSet={`${siteConfig.url}/${locale}/blog/glossary`}
      />

      <section className="py-8 sm:py-12 lg:py-16">
        <Container className="max-w-2xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: blogT("title"), href: "/blog" },
              { label: t("title"), href: "/blog/glossary" },
              { label: term.term },
            ]}
          />

          <Badge variant="electric" className="mt-6">
            {term.category}
          </Badge>
          <h1 className="mt-4 text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {term.term}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{term.shortDefinition}</p>

          <div
            className="prose prose-invert prose-headings:font-display prose-headings:font-semibold prose-a:text-gold mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: term.content }}
          />

          {term.relatedArticleSlug && (
            <Link
              href={`/blog/${term.relatedArticleSlug}`}
              className="focus-ring group mt-8 flex items-center justify-between rounded-2xl border border-gold/30 bg-gold/[0.06] p-5 transition-colors hover:border-gold/50"
            >
              <span className="text-sm font-medium text-foreground">
                {t("readFullGuide")}
              </span>
              <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </Link>
          )}

          {related.length > 0 && (
            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("relatedTerms")}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {related.map((relatedTerm) => (
                  <Link key={relatedTerm.slug} href={`/blog/glossary/${relatedTerm.slug}`}>
                    <Badge variant="outline">{relatedTerm.term}</Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10">
            <Link
              href="/blog/glossary"
              className="focus-ring text-sm text-muted-foreground hover:text-foreground"
            >
              {t("backToGlossary")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
