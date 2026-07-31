import { getTranslations, setRequestLocale } from "next-intl/server";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.settings");

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">{t("changePassword")}</h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
