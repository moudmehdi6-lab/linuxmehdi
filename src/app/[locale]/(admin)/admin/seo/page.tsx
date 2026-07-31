import { getTranslations, setRequestLocale } from "next-intl/server";
import { SeoSettingsForm } from "@/components/admin/seo-settings-form";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { safeQuery } from "@/lib/db";
import type { SeoSettingsValues } from "@/lib/validations/admin";

export default async function AdminSeoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.seo");

  const record = await safeQuery(
    () => prisma.siteSettings.findUnique({ where: { key: "seo" } }),
    null,
  );
  const defaults: SeoSettingsValues = {
    defaultTitle: siteConfig.name,
    titleTemplate: `%s | ${siteConfig.name}`,
    defaultDescription: siteConfig.tagline,
    ogImage: `${siteConfig.url}/og-image.png`,
    ...(record?.value as Partial<SeoSettingsValues> | undefined),
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8">
        <SeoSettingsForm defaults={defaults} />
      </div>
    </div>
  );
}
