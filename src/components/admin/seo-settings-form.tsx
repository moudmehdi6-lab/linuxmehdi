"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { seoSettingsSchema, type SeoSettingsValues } from "@/lib/validations/admin";
import { saveSeoSettings } from "@/actions/admin/settings";

export function SeoSettingsForm({ defaults }: { defaults: SeoSettingsValues }) {
  const t = useTranslations("admin.seo");
  const tCommon = useTranslations("admin");
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SeoSettingsValues>({ resolver: zodResolver(seoSettingsSchema), defaultValues: defaults });

  const onSubmit = async (values: SeoSettingsValues) => {
    setSaved(false);
    const result = await saveSeoSettings(values);
    if (result.success) setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5" noValidate>
      <div>
        <Label htmlFor="defaultTitle">{t("defaultTitle")}</Label>
        <Input id="defaultTitle" className="mt-2" {...register("defaultTitle")} />
      </div>
      <div>
        <Label htmlFor="titleTemplate">{t("titleTemplate")}</Label>
        <Input id="titleTemplate" className="mt-2" {...register("titleTemplate")} />
      </div>
      <div>
        <Label htmlFor="defaultDescription">{t("defaultDescription")}</Label>
        <Textarea id="defaultDescription" className="mt-2" {...register("defaultDescription")} />
      </div>
      <div>
        <Label htmlFor="ogImage">{t("ogImage")}</Label>
        <Input id="ogImage" className="mt-2" {...register("ogImage")} />
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
