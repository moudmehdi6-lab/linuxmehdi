import { getTranslations, setRequestLocale } from "next-intl/server";
import { GeneralSettingsForm } from "@/components/admin/general-settings-form";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";
import { safeQuery } from "@/lib/db";
import type { GeneralSettingsValues } from "@/lib/validations/admin";

type StoredGeneralSettings = {
  whatsappNumber?: string;
  contactEmail?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
  };
};

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.settings");

  const record = await safeQuery(
    () => prisma.siteSettings.findUnique({ where: { key: "general" } }),
    null,
  );
  const stored = record?.value as StoredGeneralSettings | undefined;

  const defaults: GeneralSettingsValues = {
    whatsappNumber: stored?.whatsappNumber ?? siteConfig.whatsappNumber,
    contactEmail: stored?.contactEmail ?? siteConfig.contactEmail,
    twitter: stored?.socialLinks?.twitter ?? siteConfig.social.twitter,
    facebook: stored?.socialLinks?.facebook ?? siteConfig.social.facebook,
    instagram: stored?.socialLinks?.instagram ?? siteConfig.social.instagram,
    telegram: stored?.socialLinks?.telegram ?? siteConfig.social.telegram,
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">{t("generalTitle")}</h2>
        <div className="mt-4">
          <GeneralSettingsForm defaults={defaults} />
        </div>
      </div>

      <div className="mt-10 max-w-xl">
        <h2 className="text-lg font-semibold">{t("brandingTitle")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("brandingNote")}</p>
      </div>
    </div>
  );
}
