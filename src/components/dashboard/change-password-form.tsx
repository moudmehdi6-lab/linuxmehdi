"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordSchema, type ChangePasswordValues } from "@/lib/validations/dashboard";
import { changePassword } from "@/actions/dashboard";

export function ChangePasswordForm() {
  const t = useTranslations("dashboard.settings");
  const [error, setError] = React.useState<string | null>(null);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = async (values: ChangePasswordValues) => {
    setError(null);
    setSaved(false);
    const result = await changePassword(values);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSaved(true);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5" noValidate>
      <div>
        <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
        <Input
          id="currentPassword"
          type="password"
          className="mt-2"
          {...register("currentPassword")}
        />
        {errors.currentPassword && (
          <p className="mt-1.5 text-xs text-destructive">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="newPassword">{t("newPassword")}</Label>
        <Input
          id="newPassword"
          type="password"
          className="mt-2"
          {...register("newPassword")}
        />
        {errors.newPassword && (
          <p className="mt-1.5 text-xs text-destructive">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          className="mt-2"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

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
