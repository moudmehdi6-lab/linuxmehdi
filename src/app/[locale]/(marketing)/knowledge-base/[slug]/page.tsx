import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { knowledgeBaseArticles } from "@/lib/knowledge-base-content";

export function generateStaticParams() {
  return knowledgeBaseArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = knowledgeBaseArticles.find((a) => a.slug === slug);
  if (!article) return {};

  return buildMetadata({
    title: article.title,
    description: article.summary,
    path: `/knowledge-base/${slug}`,
    locale,
  });
}

export default async function KnowledgeBaseArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "knowledgeBase" });
  const article = knowledgeBaseArticles.find((a) => a.slug === slug);

  if (!article) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          {
            name: t("title"),
            url: `${siteConfig.url}/${locale}/knowledge-base`,
          },
          {
            name: article.title,
            url: `${siteConfig.url}/${locale}/knowledge-base/${slug}`,
          },
        ]}
      />
      <FaqJsonLd items={[{ question: article.title, answer: article.content }]} />
      <section className="py-8 sm:py-12 lg:py-20">
        <Container className="max-w-2xl">
          <Link
            href="/knowledge-base"
            className="focus-ring inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t("title")}
          </Link>

          <Badge className="mt-6">{article.category}</Badge>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.content}</p>
        </Container>
      </section>
    </>
  );
}
