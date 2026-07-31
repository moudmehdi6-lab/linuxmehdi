import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { auth } from "@/lib/auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard.profile");
  const session = await auth();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8">
        <ProfileForm
          name={session!.user.name ?? ""}
          email={session!.user.email ?? ""}
        />
      </div>
    </div>
  );
}
