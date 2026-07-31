"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileSchema, type UpdateProfileValues } from "@/lib/validations/dashboard";
import { updateProfile } from "@/actions/dashboard";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const t = useTranslations("dashboard.profile");
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name },
  });

  const onSubmit = async (values: UpdateProfileValues) => {
    setSaved(false);
    const result = await updateProfile(values);
    if (result.success) setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5" noValidate>
      <div>
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" className="mt-2" {...register("name")} />
        {errors.name && (
          <p className="mt-1.5 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" value={email} disabled className="mt-2" />
        <p className="mt-1.5 text-xs text-muted-foreground">{t("emailNote")}</p>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {t("save")}
      </Button>

      {saved && (
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          {t("saved")}
        </p>
      )}
    </form>
  );
}
