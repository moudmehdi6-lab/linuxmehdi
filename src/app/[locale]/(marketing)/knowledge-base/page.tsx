import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHero } from "@/components/marketing/page-hero";
import { Link } from "@/i18n/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { knowledgeBaseArticles, getKnowledgeBaseCategories } from "@/lib/knowledge-base-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "knowledgeBase" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/knowledge-base",
    locale,
  });
}

export default async function KnowledgeBasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "knowledgeBase" });
  const categories = getKnowledgeBaseCategories();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: t("title"), url: `${siteConfig.url}/${locale}/knowledge-base` },
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          {categories.map((category) => (
            <div key={category} className="mb-12 last:mb-0">
              <h2 className="text-lg font-semibold">{category}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {knowledgeBaseArticles
                  .filter((article) => article.category === category)
                  .map((article) => (
                    <Link key={article.slug} href={`/knowledge-base/${article.slug}`}>
                      <Card className="h-full transition-colors hover:border-white/25">
                        <CardHeader>
                          <CardTitle className="flex items-start justify-between gap-2 text-base">
                            {article.title}
                            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                          </CardTitle>
                          <CardDescription>{article.summary}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
