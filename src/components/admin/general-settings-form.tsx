"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generalSettingsSchema, type GeneralSettingsValues } from "@/lib/validations/admin";
import { saveGeneralSettings } from "@/actions/admin/settings";

export function GeneralSettingsForm({ defaults }: { defaults: GeneralSettingsValues }) {
  const t = useTranslations("admin.settings");
  const tCommon = useTranslations("admin");
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GeneralSettingsValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: defaults,
  });

  const onSubmit = async (values: GeneralSettingsValues) => {
    setSaved(false);
    const result = await saveGeneralSettings(values);
    if (result.success) setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5" noValidate>
      <div>
        <Label htmlFor="whatsappNumber">{t("whatsappNumber")}</Label>
        <Input id="whatsappNumber" className="mt-2" {...register("whatsappNumber")} />
      </div>
      <div>
        <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
        <Input id="contactEmail" type="email" className="mt-2" {...register("contactEmail")} />
      </div>

      <h3 className="pt-2 text-sm font-semibold">{t("socialTitle")}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="twitter">{t("twitter")}</Label>
          <Input id="twitter" className="mt-2" {...register("twitter")} />
        </div>
        <div>
          <Label htmlFor="facebook">{t("facebook")}</Label>
          <Input id="facebook" className="mt-2" {...register("facebook")} />
        </div>
        <div>
          <Label htmlFor="instagram">{t("instagram")}</Label>
          <Input id="instagram" className="mt-2" {...register("instagram")} />
        </div>
        <div>
          <Label htmlFor="telegram">{t("telegram")}</Label>
          <Input id="telegram" className="mt-2" {...register("telegram")} />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {tCommon("save")}
      </Button>

      {saved && (
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {tCommon("saved")}
        </p>
      )}
    </form>
  );
}
