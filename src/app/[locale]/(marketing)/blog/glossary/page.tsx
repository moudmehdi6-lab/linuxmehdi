import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHero } from "@/components/marketing/page-hero";
import { Link } from "@/i18n/navigation";
import { BreadcrumbJsonLd, DefinedTermSetJsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import { glossaryTerms, getGlossaryCategories } from "@/lib/glossary-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "glossary" });

  return buildMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/blog/glossary",
    locale,
  });
}

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "glossary" });
  const blogT = await getTranslations({ locale, namespace: "blog" });
  const categories = getGlossaryCategories();
  const indexUrl = `${siteConfig.url}/${locale}/blog/glossary`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${siteConfig.url}/${locale}` },
          { name: blogT("title"), url: `${siteConfig.url}/${locale}/blog` },
          { name: t("title"), url: indexUrl },
        ]}
      />
      <DefinedTermSetJsonLd
        name={t("title")}
        description={t("subtitle")}
        url={indexUrl}
        terms={glossaryTerms.map((term) => ({
          name: term.term,
          description: term.shortDefinition,
          url: `${indexUrl}/${term.slug}`,
        }))}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-10 sm:pb-16 lg:pb-24">
        <Container>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                {category}
              </a>
            ))}
          </div>

          {categories.map((category) => (
            <div
              key={category}
              id={category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="mt-12 scroll-mt-24 first:mt-10"
            >
              <h2 className="font-display text-xl font-semibold">{category}</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {glossaryTerms
                  .filter((term) => term.category === category)
                  .sort((a, b) => a.term.localeCompare(b.term))
                  .map((term) => (
                    <Link key={term.slug} href={`/blog/glossary/${term.slug}`}>
                      <Card className="h-full transition-colors hover:border-white/25">
                        <CardHeader>
                          <CardTitle className="text-base">{term.term}</CardTitle>
                          <CardDescription>{term.shortDefinition}</CardDescription>
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
