"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/validations/auth";
import { resetPassword } from "@/actions/auth";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <p className="flex items-center gap-2 text-sm text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {t("invalidToken")}
      </p>
    );
  }

  const onSubmit = async (values: ResetPasswordValues) => {
    setError(null);
    const result = await resetPassword({ ...values, token });
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div>
        <p className="flex items-center gap-2 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {t("success")}
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm text-gold hover:underline">
          {t("submit")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="hidden" {...register("token")} value={token} />

      <div>
        <Label htmlFor="password">{t("password")}</Label>
        <Input id="password" type="password" className="mt-2" {...register("password")} />
        {errors.password && (
          <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>
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
          <p className="mt-1.5 text-xs text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {t("submit")}
      </Button>
    </form>
  );
}
